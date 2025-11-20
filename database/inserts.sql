INSERT INTO `t_motivo_guia` (nombre) VALUES
('Venta'),
('Compra'),
('Venta con entrega a terceros'),
('Traslado entre establecimientos de la misma empresa'),
('Consignación'),
('Devolución'),
('Recojo de bienes transformados'),
('Venta sujeta a confirmación del comprador'),
('Traslado de bienes para transformación'),
('Traslado emisor itinerante de comprobantes de pago'),
('Otros (no especificados en los anteriores)');

INSERT INTO `tipo_documento_identificacion` (tipo_documento) VALUES
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

INSERT INTO t_productos (sku, nombre, stock_actual, stock_minimo, procentaje_ganancia, precio_compra_proveedor, descripcion) VALUES
('ELC0001', 'Smartphone Modelo X', 150, 20, 0.4500, 350.00, 'Teléfono móvil de alta gama con cámara de 108MP.'),
('INF0015', 'Disco Duro SSD 1TB', 80, 10, 0.2500, 75.50, 'Unidad de estado sólido para almacenamiento rápido.'),
('ROPA010', 'Camisa Algodón Azul', 200, 50, 0.6000, 15.99, 'Camisa de vestir 100% algodón, talla M.'),
('HOGAR05', 'Set de Ollas Antiadherentes', 45, 5, 0.3000, 49.95, 'Juego de 5 piezas de ollas y sartenes.'),
('ALIM123', 'Café Tostado Premium 1kg', 120, 30, 0.3500, 8.50, 'Grano de café arábica 100%, tostado medio.');