USE `chets_nuts_foods`;

INSERT INTO `usuarios_admin` (
    nombres, 
    apellidos, 
    dni, 
    ruc, 
    tipo_domicilio, 
    ubigeo, 
    direccion_detallada, 
    correo, 
    contrasenia
) 
VALUES (
    'Juan', 
    'Pérez Rodríguez', 
    '12345678', 
    '10123456789', 
    'Domicilio fiscal', 
    '170101', 
    'Av. Principal 123, Urb. Los Álamos', 
    'juan.perez@ejemplo.com', 
    'juan123'
);

INSERT INTO `t_motivo_guia` (motivo, esta_disponible) VALUES
('Venta', TRUE),
('Compra', FALSE),
('Venta con entrega a terceros', FALSE),
('Traslado entre establecimientos de la misma empresa', FALSE),
('Consignación', FALSE),
('Devolución', FALSE),
('Recojo de bienes transformados', FALSE),
('Venta sujeta a confirmación del comprador', FALSE),
('Traslado de bienes para transformación', FALSE),
('Traslado emisor itinerante de comprobantes de pago', FALSE),
('Otros (no especificados en los anteriores)', FALSE);

INSERT INTO `t_tipos_documentos_tributarios` (tipo, esta_disponible) VALUES
('Factura', TRUE),
('Boleta de Venta', TRUE),
('Guía de Remisión Remitente', FALSE),
('Ticket o cinta emitido por máquina registradora', FALSE),
('Constancia de Depósito - IVAP (Ley 28211)', FALSE),
('Constancia de Depósito - Detracción', FALSE),
('Código de autorización emitida por el SCOP', FALSE),
('Otros, de acuerdo con selección', FALSE);


INSERT INTO `t_tipo_documento_identificacion` (tipo_documento) VALUES
('REGISTRO ÚNICO DE CONTRIBUYENTES'),
('DOCUMENTO NACIONAL DE IDENTIDAD'),
('CARNET DE EXTRANJERÍA'),
('PASAPORTE'),
('CÉDULA DIPLOMÁTICA DE IDENTIDAD'),
('DOC.IDENT.PAIS.RESIDENCIA-NO.D'),
('TAX IDENTIFICATION NUMBER - TIN - DOC TRI...'),
('IDENTIFICATION NUMBER - IN - DOC TRIB PP. JJ'),
('TAM- TARJETA ANDINA DE MIGRACIÓN'),
('PERMISO TEMPORAL DE PERMANENCIA - PTP'),
('SALVOCONDUCTO');

INSERT INTO `t_productos` (sku, nombre, stock_actual, stock_minimo, procentaje_ganancia, precio_compra_proveedor, descripcion, id_usuario_admin) VALUES
('ELC0001', 'Smartphone Modelo X', 150, 20, 0.4500, 350.00, 'Teléfono móvil de alta gama con cámara de 108MP.', 1),
('INF0015', 'Disco Duro SSD 1TB', 80, 10, 0.2500, 75.50, 'Unidad de estado sólido para almacenamiento rápido.', 1),
('ROPA010', 'Camisa Algodón Azul', 200, 50, 0.6000, 15.99, 'Camisa de vestir 100% algodón, talla M.', 1),
('HOGAR05', 'Set de Ollas Antiadherentes', 45, 5, 0.3000, 49.95, 'Juego de 5 piezas de ollas y sartenes.', 1),
('ALIM123', 'Café Tostado Premium 1kg', 120, 30, 0.3500, 8.50, 'Grano de café arábica 100%, tostado medio.', 1);

INSERT INTO `t_entidades_emisoras_autorizacion` (entidad) VALUES
('PRODUCE - Ministerio de la Producción'),
('MIN. AMBIENTE - Ministerio del Ambiente'),
('SANIPES - Organismo Nacional de Sani...'),
('MML - Municipalidad Metropolitana de...'),
('MINSA - - Ministerio de Salud'),
('GR - Gobierno Regional'),
('SUCAMEC - Superintendencia Nacional...'),
('DIGEMID - Dirección General de Medic...'),
('DIGESA - Dirección General de Salud A...'),
('SENASA - Servicio Nacional de Sanidad...'),
('SERFOR - Servicio Nacional Forestal y d...'),
('MTC - Ministerio de Transportes y Com...');