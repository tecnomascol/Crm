# CRM Inmobiliario Premium — Security Specification & Threat Model

## 1. Principios de Seguridad y Aislamiento Multi-Tenant
1. **Acceso Restringido a Usuarios con Correo Verificado**:
   - `request.auth.token.email_verified == true` es un prerrequisito no negociable para consultar o modificar cualquier dato dentro del CRM.
   - Cuentas no verificadas se mantienen en estado de retención y la interfaz bloquea el acceso con pantalla de verificación.
2. **Aislamiento Multi-Organización (`organizationId`)**:
   - Toda consulta debe coincidir con el `organizationId` del documento de usuario (`/users/{uid}`).
   - Es imposible consultar o mezclar prospectos, negocios, tareas o inventario de organizaciones ajenas.
3. **Jerarquía RBAC**:
   - `admin`: Gestión de usuarios, asignación de roles, configuración de marca, eliminación de registros sensibles y lectura de bitácora de auditoría.
   - `sales_director`: Gestión de proyectos, propiedades, embudo comercial, reasignación de prospectos y revisión de auditoría.
   - `advisor`: Gestión de prospectos asignados, creación de tareas, actualización de etapas y registro de actividades.
4. **Protección contra Escalación de Privilegios**:
   - Los usuarios tienen prohibido modificar su propio campo `role` u `organizationId` mediante `diff().affectedKeys().hasAny(['role', 'organizationId'])`.
5. **Inmutabilidad de Auditoría e Historial**:
   - Las colecciones `/auditLogs` y `/leadActivities` admiten únicamente creación (`allow create`). Las operaciones de modificación (`update`) y borrado (`delete`) están permanentemente bloqueadas a nivel de motor de reglas.

## 2. Matriz de Pruebas "Dirty Dozen" (Threat Payloads)
1. **Unverified Email Bypass**: Usuario autenticado intenta leer `/leads/{leadId}` sin verificar su correo electrónico. *(RECHAZADO: `email_verified == true` requerido)*.
2. **Cross-Tenant Scraping**: Asesor de Organización A intenta listar prospectos de Organización B. *(RECHAZADO: validación de `organizationId`)*.
3. **Self-Promotion Attack**: Asesor envía actualización `role: "admin"` a su propio perfil `/users/{uid}`. *(RECHAZADO: campos protegidos)*.
4. **Audit Log Tampering**: Intento de sobrescribir o eliminar un registro de `/auditLogs/{logId}` para ocultar una acción ilícita. *(RECHAZADO: update y delete = false)*.
5. **Activity Log Forgery**: Intento de alterar una nota pasada o cambio de etapa de un cliente. *(RECHAZADO: actividades inmutables)*.
6. **Orphan Lead Injection**: Inyección de prospecto sin `organizationId` o sin etapa válida. *(RECHAZADO)*.
7. **Inventory Price Manipulation by Advisor**: Asesor intenta cambiar el precio de una villa en `/properties/{id}`. *(RECHAZADO: solo `sales_director` o `admin`)*.
8. **Malicious Delete by Non-Admin**: Asesor intenta borrar un proyecto o eliminar a otro usuario del sistema. *(RECHAZADO: delete restringido a `admin`)*.
9. **Junk Character Path Injection**: Intento de envenenamiento de IDs de documentos con cadenas maliciosas de más de 64 caracteres. *(RECHAZADO por `isValidId()`)*.
10. **Storage File Exfiltration**: Acceso no autorizado a contratos o escrituras de compraventa sin rol adecuado. *(RECHAZADO)*.
11. **Spoofed Email Identity**: Creación de usuario intentando asociar un correo ajeno al token de autenticación. *(RECHAZADO: `request.resource.data.email == request.auth.token.email`)*.
12. **State Transition Corruption**: Intento de saltar a etapas no reconocidas en el embudo comercial. *(RECHAZADO por enum estricto)*.
