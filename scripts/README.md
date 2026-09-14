# Comprobación de navegación

Con el sitio en ejecución, usar Node y Playwright:

```powershell
node scripts/check-navigation.cjs http://127.0.0.1:4300 ruta-de-resultados
```

Si Playwright proviene de un runtime externo, definir `NODE_PATH` con su directorio de paquetes. `BROWSER_EXECUTABLE` permite seleccionar el ejecutable de Edge/Chromium instalado. El script no envía formularios ni mensajes y genera capturas y `results.json`.

Para inspeccionar enlaces directos durante desarrollo, iniciar Angular con `ng serve --host 127.0.0.1 --port 4300 --no-hmr`. Una actualización tardía de la plantilla por HMR puede reemplazar el destino después del desplazamiento inicial y falsear la comprobación.

Se comprueban los enlaces reales de Home y Proyecto, el orden del menú, los encabezados visibles bajo la cabecera, la selección activa, Atrás/Adelante, un enlace repetido tras desplazarse, enlaces directos y entre rutas, regreso a Inicio, galería, Escape, redimensionamiento y anchos intermedios. La llegada a Inicio admite un residuo de hasta 4 px del navegador y exige que el título quede visible; un retorno desplazado 80–90 px falla.

## Video y acciones del hero

`node scripts/check-hero-video.cjs http://127.0.0.1:4300 ruta-de-resultados` comprueba avance real del tiempo de video, pausa/reproducción, salida y regreso al hero, conservación de la pausa manual, cambios repetidos de ruta, Play explícito con movimiento reducido y recuperación de una petición de video fallida. Comprueba también que ambos CTA comerciales llegan a sus secciones sin recargar el documento ni salir de `/proyecto`. La prueba de visibilidad dispara el evento con un estado de documento oculto simulado. No envía mensajes ni formularios.
