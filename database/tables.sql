CREATE SCHEMA `chets_nuts_foods`;

USE `chets_nuts_foods`;

CREATE TABLE `usuarios_admin` (
	id INT NOT NULL auto_increment,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(8) NOT NULL,
    ruc VARCHAR(11) NOT NULL,
    
    -- datos necesarios para emitir guia de remisión
    tipo_domicilio VARCHAR(100) NOT NULL default 'Domicilio fiscal',
    ubigeo VARCHAR(6) NOT NULL default '170101',
    direccion_detallada VARCHAR(150) NOT NULL,
    
    -- credenciales de acceso al sistema
    correo VARCHAR(100) NOT NULL,
    contrasenia VARCHAR(150) NOT NULL
);

CREATE TABLE `t_motivo_guia` (
	id INT NOT NULL auto_increment,
    motivo VARCHAR(100) NOT NULL
);	

CREATE TABLE `t_tipo_documento_identificacion` (
	id INT NOT NULL auto_increment,
    tipo_documento VARCHAR(100) NOT NULL
);

CREATE TABLE `t_destinatario` (
	id INT NOT NULL auto_increment,
    id_tipo_documento_identificacion INT NOT NULL,
    numero_documento VARCHAR(100) NOT NULL,
	apellidos_nombres_razon_social VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_tipo_documento) REFERENCES `t_motivo_guia`(id)
        ON UPDATE CASCADE
);

CREATE TABLE `t_guia_remision` (
	id INT NOT NULL auto_increment,
    esComercioExterior BOOLEAN default FALSE,
    id_motivo_traslacion INT NOT NULL,
    id_remitente INT NOT NULL,
    id_destinatario INT NOT NULL,
    unidad_medida_peso_bruto ENUM('kilogramo', 'toneladas') NOT NULL,
    medida_peso_bruto DECIMAL(6,2) NOT NULL,
    
    -- INFORMACIÓN DE QUE TIPO DE PUNTO DE PARTIDA SE CONSIDERA EN LA GUIA DE REMISIÓN
    tipo_punto_partida ENUM('remitente','tercero','otra_direccion') NOT NULL,
    tipo_punto_llegada ENUM('tercero','otra_direccion') NOT NULL,
    
    -- DEFINICIÓN DE UN PUNTO DE PARTIDA DE UN TERCERO CON RUC ----- (PARTIDA)
    tipo_domicilio VARCHAR(100) NULL default 'Domicilio fiscal',
    ubigeo VARCHAR(6) NULL default '170101',
    direccion_detallada VARCHAR(150) NULL,
    
    -- DEFINICIÓN DEL PUNTO DE PARTIDA ----- (PARTIDA)
	departamento VARCHAR(150) NULL,
    provincia VARCHAR(150) NULL,
    distrito VARCHAR(150) NULL,
    direccion_detallada VARCHAR(150) NULL,
        
    -- DEFINICIÓN DE UN PUNTO DE LLEGADA DE UN TERCERO CON RUC ----- (LLEGADA)
    tipo_domicilio VARCHAR(100) NULL default 'Domicilio fiscal',
    ubigeo VARCHAR(6) NULL default '170101',
    direccion_detallada VARCHAR(150) NULL,
    
    -- DEFINICIÓN DEL PUNTO DE LLEGADA SIN DEFINIR ----- (LLEGADA)
	departamento VARCHAR(150) NULL,
    provincia VARCHAR(150) NULL,
    distrito VARCHAR(150) NULL,
    direccion_detallada VARCHAR(150) NULL,
    
    FOREIGN KEY (id_destinatario) REFERENCES `usuarios_admin`(id)
		ON UPDATE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES `t_destinatario`(id)
        ON UPDATE CASCADE,
    FOREIGN KEY (id_motivo_traslacion) REFERENCES `t_motivo_guia`(id)
        ON UPDATE CASCADE
);

CREATE TABLE `t_documentos_tributarios` (
	id int not null auto_increment,
    id_tipo_documento_tributario INT NOT NULL,
    tipo_documento ENUM('ruc','dni') NOT NULL,
    serie VARCHAR(4) NOT NULL,
    numero_documento VARCHAR(7) NOT NULL,
    nombre_razon_social INT NOT NULL
);

CREATE TABLE `t_productos` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(7) NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    stock_actual INT NOT NULL,
    stock_minimo INT NOT NULL,
    procentaje_ganancia DECIMAL(1,4) NOT NULL,
    precio_compra_proveedor DECIMAL(6,2) NOT NULL,
    descripcion VARCHAR(150)
);

CREATE TABLE `t_detalle_documento_tributario` (
	id INT NOT NULL auto_increment,
    
    -- INFORMACION ESTÁTICA DEL PRODUCTO
	producto_id INT NOT NULL, -- no está relacionado, el valor es estático.
    sku VARCHAR(7) NOT NULL,
    nombre_producto VARCHAR(80) NOT NULL,
    procentaje_ganancia DECIMAL(1,4) NOT NULL,
    precio_unitario DECIMAL(6,2) NOT NULL,
    cantidad DECIMAL(6,2) NOT NULL,
    monto_total_cobrado DECIMAL(6,2) NOT NULL,
    
    -- INFORMACIÓN DEL DOCUMENTO TRIBUTARIO
    id_documentos_tributarios INT NOT NULL auto_increment,
    FOREIGN KEY (id_documentos_tributarios) REFERENCES `t_documentos_tributarios`(id)
        ON UPDATE CASCADE
);

CREATE TABLE `t_guiaRemision_documentoTributario` (
	id INT NOT NULL auto_increment,
    id_guia_remision INT NOT NULL,
    id_documento_relacionado INT NOT NULL,
	FOREIGN KEY (id_documento_relacionado) REFERENCES `id_documento_relacionado`(id)
		ON UPDATE CASCADE,
	FOREIGN KEY (id_guia_remision) REFERENCES `t_guia_remision`(id)
		ON UPDATE CASCADE
    -- refinir la relacion entre la guia y la remisión
);

