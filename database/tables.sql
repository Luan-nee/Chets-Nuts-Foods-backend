DROP DATABASE if exists `chets_nuts_foods`;

CREATE SCHEMA `chets_nuts_foods`;

USE `chets_nuts_foods`;

CREATE TABLE `usuarios_admin` (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) NOT NULL UNIQUE COMMENT "Documento Nacional de Identidad del administrador.",
    ruc VARCHAR(11) NOT NULL COMMENT "Registro Único de Contribuyente.",
    
    -- datos necesarios para emitir guia de remisión
    tipo_domicilio VARCHAR(100) NOT NULL DEFAULT 'Domicilio fiscal' COMMENT "Tipo de domicilio (ej. Domicilio fiscal, Almacén, etc.)",
    ubigeo VARCHAR(6) NOT NULL DEFAULT '170101' COMMENT "Código UBIGEO del domicilio.",
    direccion_detallada VARCHAR(150) NOT NULL COMMENT "Dirección completa y detallada.",
    
    -- credenciales de acceso al sistema
    correo VARCHAR(100) NOT NULL UNIQUE COMMENT "Correo electrónico para acceso al sistema (debe ser único).",
    contrasenia VARCHAR(150) NOT NULL COMMENT "Contraseña hasheada del usuario."
) 
COMMENT = "
**Propósito:** Almacena la información de los usuarios administradores del sistema.

### Valores Insertados

A continuación, se lista el usuario administrador que se ha insertado en la tabla:

| id | nombres | apellidos | dni | ruc | tipo\_domicilio | ubigeo | direccion\_detallada | correo | contrasenia |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :--- | :--- | :--- |
| 1 | Juan | Pérez Rodríguez | 12345678 | 10123456789 | Domicilio fiscal | 170101 | Av. Principal 123, Urb. Los Álamos | juan.perez@ejemplo.com | juan123 |
";

CREATE TABLE `t_motivo_guia` (
    id INT NOT NULL auto_increment PRIMARY KEY COMMENT "Identificador único del motivo.",
    motivo VARCHAR(100) NOT NULL COMMENT "Descripción del motivo por el cual se emite la guía de remisión (ej. Venta, Traslado entre almacenes, compra, etc...).",
    esta_disponible BOOLEAN NOT NULL DEFAULT FALSE COMMENT "Indica si el motivo está disponible dentro del sistema"
)
COMMENT = "
**Propósito:** Almacena los motivos por los cuales se emite la guía de remisión.

### Valores Insertados

A continuación, se listan los motivos de guía de remisión que se han insertado en la tabla:

| id | motivo | esta_disponible |
| :---: | :--- | :--- |
| 1 | Venta | TRUE |
| 2 | Compra | FALSE |
| 3 | Venta con entrega a terceros | FALSE |
| 4 | Traslado entre establecimientos de la misma empresa | FALSE |
| 5 | Consignación | FALSE |
| 6 | Devolución | FALSE |
| 7 | Recojo de bienes transformados | FALSE |
| 8 | Venta sujeta a confirmación del comprador | FALSE |
| 9 | Traslado de bienes para transformación | FALSE |
| 10 | Traslado emisor itinerante de comprobantes de pago | FALSE |
| 11 | Otros (no especificados en los anteriores) | FALSE |
";

CREATE TABLE `t_tipo_documento_identificacion` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único para el tipo de documento.",
    tipo_documento VARCHAR(100) NOT NULL COMMENT "Nombre del tipo de documento (ej. DNI, RUC, Carné de Extranjería, Pasaporte)."
)
COMMENT = "
**Propósito:** Almacena los tipos de documentos de identificación para identificar a una persona, negocio o empresa.

### Valores Insertados

A continuación, se listan los tipos de documentos de identificación que se han insertado en la tabla:

| id | tipo\_documento |
| :---: | :--- |
| 1 | REGISTRO ÚNICO DE CONTRIBUYENTES |
| 2 | DOCUMENTO NACIONAL DE IDENTIDAD |
| 3 | CARNET DE EXTRANJERÍA |
| 4 | PASAPORTE |
| 5 | CÉDULA DIPLOMÁTICA DE IDENTIDAD |
| 6 | DOC.IDENT.PAIS.RESIDENCIA-NO.D |
| 7 | TAX IDENTIFICATION NUMBER - TIN - DOC TRI... |
| 8 | IDENTIFICATION NUMBER - IN - DOC TRIB PP. JJ |
| 9 | TAM- TARJETA ANDINA DE MIGRACIÓN |
| 10 | PERMISO TEMPORAL DE PERMANENCIA - PTP |
| 11 | SALVOCONDUCTO |
";

CREATE TABLE `t_destinatario` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único del destinatario.",
    id_tipo_documento_identificacion INT NOT NULL COMMENT "Referencia al tipo de documento (DNI, RUC, Pasaporte) de la tabla **t_tipo_documento_identificacion**.",
    numero_documento VARCHAR(100) NOT NULL COMMENT "Número del documento de identificación (DNI o RUC).",
    apellidos_nombres_razon_social VARCHAR(100) NOT NULL COMMENT "Apellidos y Nombres o Razón Social del destinatario.",
    
    FOREIGN KEY (id_tipo_documento_identificacion) REFERENCES `t_tipo_documento_identificacion`(id)
        ON UPDATE CASCADE
)
COMMENT = "
**Propósito:** Almacena la información de la entidad o persona que recibirá los bienes en una guía de remisión.

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_tipo_documento_identificacion)` se refiere a la columna **id** de la tabla `t_tipo_documento_identificacion`.
    * **Acción en UPDATE:** `CASCADE`
";

CREATE TABLE `t_entidades_emisoras_autorizacion` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único de la entidad.",
    entidad VARCHAR(100) NOT NULL COMMENT "Nombre de la entidad emisora (ej. SUNAT, Aduanas, Ministerio de Transportes)."
)
COMMENT = "
**Propósito:** Almacena las entidades o instituciones que emiten autorizaciones requeridas para el traslado de cargas especiales.

### Valores Insertados

A continuación, se listan las entidades emisoras de autorización que se han insertado en la tabla:

| id | entidad |
| :---: | :--- |
| 1 | PRODUCE - Ministerio de la Producción |
| 2 | MIN. AMBIENTE - Ministerio del Ambiente |
| 3 | SANIPES - Organismo Nacional de Sani... |
| 4 | MML - Municipalidad Metropolitana de... |
| 5 | MINSA - - Ministerio de Salud |
| 6 | GR - Gobierno Regional |
| 7 | SUCAMEC - Superintendencia Nacional... |
| 8 | DIGEMID - Dirección General de Medic... |
| 9 | DIGESA - Dirección General de Salud A... |
| 10 | SENASA - Servicio Nacional de Sanidad... |
| 11 | SERFOR - Servicio Nacional Forestal y d... |
| 12 | MTC - Ministerio de Transportes y Com... |
";

CREATE TABLE `t_guia_remision` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único de la Guía de Remisión.",
    esComercioExterior BOOLEAN DEFAULT FALSE COMMENT "Indica si la guía corresponde a una operación de comercio exterior.",
    
    -- REFERENCIAS CLAVE
    id_motivo_traslacion INT NOT NULL COMMENT "Clave foránea a la tabla de motivos de guía (t_motivo_guia).",
    id_remitente INT NOT NULL COMMENT "Clave foránea al usuario administrador (usuarios_admin) que remite.",
    id_destinatario INT NOT NULL COMMENT "Clave foránea al destinatario (t_destinatario) de los bienes.",
    
    -- INFORMACIÓN DE PESO
    unidad_medida_peso_bruto ENUM('kilogramo', 'toneladas') NOT NULL COMMENT "Unidad de medida del peso bruto total (KG o TON).",
    medida_peso_bruto DECIMAL(6,2) NOT NULL COMMENT "Peso bruto total de los bienes a trasladar.",
    
    -- TIPO DE PUNTOS (LÓGICA CONDICIONAL)
    tipo_punto_partida ENUM('remitente','tercero','otra_direccion') NOT NULL COMMENT "Define el tipo de dirección de partida (si es la del remitente, un tercero o una dirección no definida).",
    tipo_punto_llegada ENUM('tercero','otra_direccion') NOT NULL COMMENT "Define el tipo de dirección de llegada (tercero o una dirección no definida).",
    
    -- PUNTO DE PARTIDA DE UN TERCERO CON RUC (USADO si tipo_punto_partida = 'tercero')
    tipo_domicilio_partida VARCHAR(100) NULL DEFAULT 'Domicilio fiscal' COMMENT "Tipo de domicilio si la partida es un tercero.",
    ubigeo_partida VARCHAR(6) NULL DEFAULT '170101' COMMENT "UBIGEO del punto de partida si es un tercero.",
    direccion_detallada_partida VARCHAR(150) NULL COMMENT "Dirección detallada del punto de partida si es un tercero.",
    
    -- PUNTO DE PARTIDA SIN RUC (USADO si tipo_punto_partida = 'otra_direccion')
    departamento_partida_nuevo VARCHAR(150) NULL COMMENT "Departamento si el punto de partida es una dirección no definida.",
    provincia_partida_nuevo VARCHAR(150) NULL COMMENT "Provincia si el punto de partida es una dirección no definida.",
    distrito_partida_nuevo VARCHAR(150) NULL COMMENT "Distrito si el punto de partida es una dirección no definida.",
    direccion_detallada_partida_nuevo VARCHAR(150) NULL COMMENT "Dirección detallada si el punto de partida es una dirección no definida.",
    
    -- PUNTO DE LLEGADA DE UN TERCERO CON RUC (USADO si tipo_punto_llegada = 'tercero')
    tipo_domicilio_llegada VARCHAR(100) NULL DEFAULT 'Domicilio fiscal' COMMENT "Tipo de domicilio si la llegada es un tercero.",
    ubigeo_llegada VARCHAR(6) NULL DEFAULT '170101' COMMENT "UBIGEO del punto de llegada si es un tercero.",
    direccion_detallada_llegada VARCHAR(150) NULL COMMENT "Dirección detallada del punto de llegada si es un tercero.",
    
    -- PUNTO DE LLEGADA SIN RUC (USADO si tipo_punto_llegada = 'otra_direccion')
    departamento_llegada_nuevo VARCHAR(150) NULL COMMENT "Departamento si el punto de llegada es una dirección no definida.",
    provincia_llegada_nuevo VARCHAR(150) NULL COMMENT "Provincia si el punto de llegada es una dirección no definida.",
    distrito_llegada_nuevo VARCHAR(150) NULL COMMENT "Distrito si el punto de llegada es una dirección no definida.",
    direccion_detallada_llegada_nuevo VARCHAR(150) NULL COMMENT "Dirección detallada si el punto de llegada es una dirección no definida.",
    
    -- MODALIDAD DE TRASLADO
    tipo_transporte ENUM('privado', 'publico') NOT NULL DEFAULT 'privado' COMMENT "Define si el transporte es privado o público.",
    esTransbordoProgramado BOOLEAN NOT NULL DEFAULT FALSE COMMENT "Indica si se requiere transbordo programado.",
    esVehiculoCategoriaM1oL BOOLEAN NOT NULL DEFAULT FALSE COMMENT "Indica si se usa un vehículo de categoría M1 o L.",
    
    -- INFORMACIÓN DE VEHÍCULO (si aplica)
    placa_vehiculo_M1_L VARCHAR(8) NULL COMMENT "Placa del vehículo si es de categoría M1 o L.",
    fecha_inicio_traslado DATE NOT NULL COMMENT "Fecha programada para el inicio del traslado.",
    
    -- AUTORIZACIÓN ESPECIAL
    necesita_autorizacion BOOLEAN NOT NULL DEFAULT FALSE COMMENT "Indica si se requiere autorización especial para el traslado.",
    id_entidad_autorizacion_especial INT NULL COMMENT "Clave foránea a la entidad emisora de la autorización especial.",
    numero_autorizacion VARCHAR(100) NULL COMMENT "Número de la autorización especial de traslado de carga.",
    
    -- OTROS DATOS LOGÍSTICOS
    retorno_envases_embalajes_vacios BOOLEAN NULL DEFAULT FALSE COMMENT "Indica si la guía incluye el retorno de envases o embalajes vacíos.",
    retorno_vehiculo_vacio BOOLEAN NULL DEFAULT FALSE COMMENT "Indica si el vehículo regresa vacío.",
    
    -- DEFINICIÓN DE CLAVES FORÁNEAS
    FOREIGN KEY (id_entidad_autorizacion_especial) REFERENCES `t_entidades_emisoras_autorizacion`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_remitente) REFERENCES `usuarios_admin`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES `t_destinatario`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_motivo_traslacion) REFERENCES `t_motivo_guia`(id)
        ON UPDATE CASCADE
)
COMMENT = "
**Propósito:** Almacena los datos principales y logísticos de la Guía de Remisión Electrónica.

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_entidad_autorizacion_especial)` se refiere a la columna **id** de la tabla `t_entidades_emisoras_autorizacion`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_remitente)` se refiere a la columna **id** de la tabla `usuarios_admin`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_destinatario)` se refiere a la columna **id** de la tabla `t_destinatario`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_motivo_traslacion)` se refiere a la columna **id** de la tabla `t_motivo_guia`.
    * **Acción en UPDATE:** `CASCADE`
";

CREATE TABLE `detalle_datos_vehículos_conductores` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único del detalle de vehículo/conductor.",
    id_guia_remision INT NOT NULL COMMENT "Clave foránea a la guía de remisión a la que pertenece este detalle.",
    modalidad_traslado_publico ENUM('privado','publico') NOT NULL COMMENT "Indica la modalidad de transporte para esta guía.",
    
    -- AUTORIZACIÓN ESPECIAL (Nota: Estos campos están duplicados de t_guia_remision)
    necesita_autorizacion BOOLEAN NOT NULL DEFAULT FALSE COMMENT "Indica si el traslado requiere autorización especial.",
    id_entidad_autorizacion_especial INT NULL COMMENT "Clave foránea a la entidad emisora de la autorización especial.",
    numero_autorizacion VARCHAR(100) NULL COMMENT "Número de la autorización especial de traslado de carga.",
    
    -- DATOS PARA TRASLADO PRIVADO (Campos con valores si modalidad_traslado_publico = 'privado')
    numero_placa VARCHAR(8) NOT NULL COMMENT "Número de placa del vehículo usado en traslado privado.",
    numero_licencia_conducir VARCHAR(10) NOT NULL COMMENT "Número de licencia de conducir del conductor privado.",
    id_tipo_documento_identidad INT NOT NULL COMMENT "Tipo de documento de identificación del conductor privado (FK a t_tipo_documento_identificacion).",
    numero_documento VARCHAR(100) NOT NULL COMMENT "Número de documento de identidad del conductor privado.",
    apellidos_nombres_razon_social VARCHAR(100) NOT NULL COMMENT "Apellidos y Nombres del conductor o Razón Social de la empresa privada.",
    
    -- DATOS PARA TRASLADO PÚBLICO (Campos con valores si modalidad_traslado_publico = 'publico')
    ruc_transportista_publico VARCHAR(11) NULL COMMENT "RUC del transportista público contratado.",
    apellidos_nombres_razon_social_publico VARCHAR(100) NULL COMMENT "Razón Social del transportista público.",
    numero_registro_MTC_publico VARCHAR(100) NULL COMMENT "Número de registro MTC del transportista público.",
    
    -- DEFINICIÓN DE CLAVES FORÁNEAS
    FOREIGN KEY (id_entidad_autorizacion_especial) REFERENCES `t_entidades_emisoras_autorizacion`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_tipo_documento_identidad) REFERENCES `t_tipo_documento_identificacion`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_guia_remision) REFERENCES `t_guia_remision`(id)
        ON UPDATE CASCADE
)
COMMENT = "
**Propósito:** Almacena los datos del vehículo y conductor específicos para una Guía de Remisión, incluyendo la distinción entre transporte privado y público.

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_entidad_autorizacion_especial)` se refiere a la columna **id** de la tabla `t_entidades_emisoras_autorizacion`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_tipo_documento_identidad)` se refiere a la columna **id** de la tabla `t_tipo_documento_identificacion`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_guia_remision)` se refiere a la columna **id** de la tabla `t_guia_remision`.
    * **Acción en UPDATE:** `CASCADE`
";

CREATE TABLE `t_tipos_documentos_tributarios` (
    id INT NOT NULL auto_increment PRIMARY KEY COMMENT "Identificador único del tipo de documento tributario.",
    tipo VARCHAR(100) NOT NULL COMMENT "Descripción del documento tributario relacionado con la guía de remisión (ej. Factura, Boleta, NotaCredito, etc...).",
    esta_disponible BOOLEAN NOT NULL DEFAULT FALSE COMMENT "Indica si el documento se puede usar dentro del sistema"
) COMMENT = "
**Propósito:** Almacena los tipos de documentos tributarios que se pueden usar dentro del sistema.

### Valores Insertados

A continuación, se listan los tipos de documentos tributarios que se han insertado en la tabla:

| id | tipo | esta\_disponible |
| :---: | :--- | :---: |
| 1 | Factura | TRUE |
| 2 | Boleta de Venta | TRUE |
| 3 | Guía de Remisión Remitente | FALSE |
| 4 | Ticket o cinta emitido por máquina registradora | FALSE |
| 5 | Constancia de Depósito - IVAP (Ley 28211) | FALSE |
| 6 | Constancia de Depósito - Detracción | FALSE |
| 7 | Código de autorización emitida por el SCOP | FALSE |
| 8 | Otros, de acuerdo con selección | FALSE |
";

CREATE TABLE `t_documentos_tributarios` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único del registro del documento tributario.",
    id_tipo_documento_tributario INT NOT NULL COMMENT "Clave foránea que identifica el tipo de documento (ej. Factura, Boleta, etc...).",
    id_tipo_documento_identificacion INT NOT NULL COMMENT "Referencia al tipo de documento (DNI, RUC, Pasaporte) de la tabla **t_tipo_documento_identificacion**.",
    numero_identificacion_receptor VARCHAR(100) NOT NULL COMMENT "Número del documento de identificación (DNI o RUC).",
    apellidos_nombres_razon_social VARCHAR(100) NOT NULL COMMENT "Apellidos y Nombres o Razón Social de quien va recibir este documento tributario.",
    
    serie VARCHAR(4) NOT NULL COMMENT "Serie del documento tributario (ej. F001, B003).",
    numero_correlativo VARCHAR(7) NOT NULL COMMENT "Número correlativo del documento tributario.",

    FOREIGN KEY (id_tipo_documento_tributario) REFERENCES `t_tipos_documentos_tributarios`(id)
		ON UPDATE CASCADE,
	FOREIGN KEY (id_tipo_documento_identificacion) REFERENCES `t_tipo_documento_identificacion`(id)
		ON UPDATE CASCADE,
    -- Se podría añadir un índice único compuesto para evitar duplicidad de documentos
    UNIQUE KEY uk_documento (numero_correlativo)
)
COMMENT = "
**Propósito:** Almacena el registro de documentos tributarios (facturas, boletas, etc.) emitidos o recibidos.

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_tipo_documento_tributario)` se refiere a la columna **id** de la tabla `t_tipos_documentos_tributarios`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_tipo_documento_identificacion)` se refiere a la columna **id** de la tabla `t_tipo_documento_identificacion`.
    * **Acción en UPDATE:** `CASCADE`

### Claves Únicas

* **Clave Única:** `UNIQUE KEY uk_documento` en la columna **numero\_correlativo** para evitar la duplicidad del número de documento.
";

CREATE TABLE `t_productos` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único del producto.",
    sku VARCHAR(7) NOT NULL UNIQUE COMMENT "Stock Keeping Unit: Código único del producto, usado para inventario.",
    nombre VARCHAR(80) NOT NULL COMMENT "Nombre comercial del producto.",
    stock_actual INT NOT NULL COMMENT "Cantidad actual disponible del producto en inventario.",
    stock_minimo INT NOT NULL COMMENT "Umbral mínimo de stock que dispara una alerta de reposición.",
    procentaje_ganancia DECIMAL(5,4) NOT NULL COMMENT "Porcentaje de ganancia deseado sobre el precio de compra (ej. 0.2500 para 25%).",
    precio_compra_proveedor DECIMAL(6,2) NOT NULL COMMENT "Precio al que se compró el producto al proveedor.",
    descripcion VARCHAR(150) COMMENT "Descripción corta del producto.",
    id_usuario_admin INT NOT NULL COMMENT "Clave foránea al usuario administrador que registró o modificó el producto por última vez.",
    
    FOREIGN KEY (id_usuario_admin) REFERENCES `usuarios_admin`(id)
        ON UPDATE CASCADE
)
COMMENT = "
**Propósito:** Almacena el catálogo de productos de la tienda virtual, incluyendo datos de inventario y costos.

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_usuario_admin)` se refiere a la columna **id** de la tabla `usuarios_admin`.
    * **Acción en UPDATE:** `CASCADE`

---

### Valores Insertados

*No se proporcionaron sentencias INSERT para esta tabla.*
";

CREATE TABLE `t_detalle_documento_tributario` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único de la línea de detalle del documento tributario.",
    
    -- INFORMACION ESTÁTICA DEL PRODUCTO (Snapshot)
    producto_id INT NOT NULL COMMENT "ID del producto de la tabla t_productos en el momento de la venta (valor estático, no FK).",
    sku VARCHAR(7) NOT NULL COMMENT "SKU del producto en el momento de la venta.",
    nombre_producto VARCHAR(80) NOT NULL COMMENT "Nombre del producto en el momento de la venta.",
    procentaje_ganancia DECIMAL(5,4) NOT NULL COMMENT "Porcentaje de ganancia registrado al momento de la venta.",
    precio_unitario DECIMAL(6,2) NOT NULL COMMENT "Precio unitario final cobrado en el momento de la venta.",
    cantidad DECIMAL(6,2) NOT NULL COMMENT "Cantidad de unidades vendidas de este producto.",
    monto_total_cobrado DECIMAL(6,2) NOT NULL COMMENT "Monto total de esta línea de detalle (precio_unitario * cantidad).",
    
    -- INFORMACIÓN DEL DOCUMENTO TRIBUTARIO
    id_documentos_tributarios INT NOT NULL COMMENT "Clave foránea al documento tributario (Factura/Boleta) al que pertenece este detalle.",
    
    FOREIGN KEY (id_documentos_tributarios) REFERENCES `t_documentos_tributarios`(id)
        ON UPDATE CASCADE
)
COMMENT = "
**Propósito:** Almacena los detalles inmutables (productos y precios) de cada línea de un documento tributario.

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_documentos_tributarios)` se refiere a la columna **id** de la tabla `t_documentos_tributarios`.
    * **Acción en UPDATE:** `CASCADE`
";

CREATE TABLE `t_guiaRemision_documentoTributario` (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY COMMENT "Identificador único de la relación.",
    id_guia_remision INT NOT NULL COMMENT "Clave foránea a la Guía de Remisión.",
    id_documento_relacionado INT NOT NULL COMMENT "Clave foránea al Documento Tributario (Factura/Boleta).",
    
    -- Restricción para evitar duplicados en la relación
    UNIQUE KEY uk_relacion_guia_doc (id_guia_remision, id_documento_relacionado),
    
    FOREIGN KEY (id_documento_relacionado) REFERENCES `t_documentos_tributarios`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_guia_remision) REFERENCES `t_guia_remision`(id)
        ON UPDATE CASCADE
)
COMMENT = "
**Propósito:** Tabla de unión para la **relación M:N** (Muchos a Muchos) entre Guías de Remisión (`t_guia_remision`) y Documentos Tributarios (`t_documentos_tributarios`).

### Restricciones Adicionales (Foreign Keys)

* `FOREIGN KEY (id_documento_relacionado)` se refiere a la columna **id** de la tabla `t_documentos_tributarios`.
    * **Acción en UPDATE:** `CASCADE`
* `FOREIGN KEY (id_guia_remision)` se refiere a la columna **id** de la tabla `t_guia_remision`.
    * **Acción en UPDATE:** `CASCADE`

### Claves Únicas

* **Clave Única Compuesta:** `UNIQUE KEY uk_relacion_guia_doc` en las columnas (`id_guia_remision`, `id_documento_relacionado`). Esta restricción asegura que una misma guía no pueda ser relacionada dos veces con el mismo documento.
";

