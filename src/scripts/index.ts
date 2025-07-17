
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
var container;
var camera, scene, renderer;
var water, sun;
var cloudMeshes = [];
var cloudConfigs = [];
init();

function init() {
    container = document.getElementById("container");

    // Renderizador
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    container.appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();

    // Cargar textura de cielo
    const textureLoader = new THREE.TextureLoader();
    const skyTexture = textureLoader.load(
        '/skybox/cloud_sky.jpg', // Necesitarás añadir esta textura a tu carpeta public/skybox/
        (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture; // Esto ayuda con las reflexiones
        }
    );

    // Opcional: Ajustar la intensidad de la luz ambiental para que coincida con el nuevo cielo
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Cámara
    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        1,
        20000,
    );
    camera.position.set(0, 100, 0); // Vista desde arriba
    camera.lookAt(0, 0, 0);

    // Sol
    sun = new THREE.Vector3();

    // Agua
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    water = new Water(waterGeometry, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(
            "/waternormals.jpg",
            function (texture) {
                texture.wrapS = texture.wrapT =
                    THREE.RepeatWrapping;
            },
        ),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
    });
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    // Configuración del sol para las sombras (mantenemos esto para la iluminación)
    const parameters = {
        elevation: 5,
        azimuth: 180,
    };

    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    water.material.uniforms["sunDirection"].value.copy(sun).normalize();

    // Generador de entorno
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sceneEnv = new THREE.Scene();
    scene.add(water);
    const renderTarget = pmremGenerator.fromScene(sceneEnv);
    scene.environment = renderTarget.texture;

    // --- NUBES ---
    const cloudTexture1 = new THREE.TextureLoader().load("/clouds/cloud1.png");
    const cloudTexture2 = new THREE.TextureLoader().load("/clouds/cloud2.png");
    const cloudTexture3 = new THREE.TextureLoader().load("/clouds/cloud3.png");

    const cloudMaterial1 = new THREE.MeshBasicMaterial({
        map: cloudTexture1,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
    });
    const cloudMaterial2 = new THREE.MeshBasicMaterial({
        map: cloudTexture2,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
    });
    const cloudMaterial3 = new THREE.MeshBasicMaterial({
        map: cloudTexture3,
        transparent: true,
        depthWrite: false,
        opacity: 0.7,
    });

    // Crear varias nubes con posiciones y tamaños variados
    cloudConfigs = [
        { x: -200, y: 70, z: -400, scale: 180, mat: cloudMaterial1 },
        { x: 300, y: 110, z: -350, scale: 150, mat: cloudMaterial2 },
        { x: 0, y: 190, z: -500, scale: 220, mat: cloudMaterial3 },
        { x: -350, y: 100, z: -300, scale: 120, mat: cloudMaterial2 },
    ];
    cloudConfigs.forEach(cfg => {
        const geometry = new THREE.PlaneGeometry(cfg.scale, cfg.scale * 0.5);
        const mesh = new THREE.Mesh(geometry, cfg.mat);
        mesh.position.set(cfg.x, cfg.y, cfg.z);
        mesh.rotation.x = 0; // Sin inclinación
        scene.add(mesh);
        cloudMeshes.push(mesh);
    });

    // FARO 3D (GLB)
    const gltfLoader = new GLTFLoader();
    gltfLoader.load('/lighthouse.glb', function (gltf) {
        const lighthouse = gltf.scene;
        lighthouse.position.set(0, -20, -9000); // Centrado, horizonte
        lighthouse.scale.set(3, 3, 3); // Ajusta el tamaño según sea necesario
        lighthouse.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(lighthouse);
    });

    // Evento de cambio de tamaño
    window.addEventListener("resize", onWindowResize);

    // Iniciar animación
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    const time = performance.now() * 0.001;
    water.material.uniforms["time"].value += 1.0 / 60.0;

    // Movimiento horizontal lento de las nubes
    cloudMeshes.forEach((mesh, i) => {
        const baseX = cloudConfigs[i].x;
        const speed = 5 + i * 2; // Velocidad diferente para cada nube
        mesh.position.x = baseX + Math.sin(time / speed + i) * 40; // Oscilación suave
    });

    renderer.render(scene, camera);
}

// -------- Scroll-driven camera animation --------
window.addEventListener("load", () => {
    // Referencias a elementos DOM
    const scrollSpace = document.getElementById("scroll-space");
    const introText = document.querySelector(".intro-text") as HTMLElement;
    const oceanTexts = document.querySelectorAll(".ocean-text");
    const scrollIndicator = document.querySelector(".scroll-indicator") as HTMLElement;
    const textContainer = document.querySelector(".text-container") as HTMLElement;
    const oceanText1 = document.querySelector(".ocean-text-1") as HTMLElement;
    const oceanText2 = document.querySelector(".ocean-text-2") as HTMLElement;
    const spyglassContainer = document.querySelector(".spyglass-container") as HTMLElement;
    const spyglassInner = document.querySelector(".spyglass-inner") as HTMLElement;

    // Calcular puntos de referencia para el scroll
    const totalScrollHeight = document.body.scrollHeight - window.innerHeight;
    const cameraAnimationEnd = window.innerHeight * 1.2; // Altura del scroll-space
    const text1Start = cameraAnimationEnd;
    const text1End = cameraAnimationEnd + window.innerHeight * 1.2; // Aumentado para más duración
    const text2Start = text1End - window.innerHeight * 0.3; // Superposición para transición suave
    const text2End = text2Start + window.innerHeight * 2; // Aumentado significativamente para más duración
    const spyglassStart = text2End + window.innerHeight * 0.2; // El catalejo comienza más tarde para evitar solaparse con el texto
    
    // Definir punto específico donde comienza la sección final (justo después del catalejo)
    const finalMessageStart = spyglassStart + window.innerHeight * 1.5; // Después de la animación del catalejo
    const finalMessageDuration = window.innerHeight * 1; // Duración extendida para la sección final
    
    // Variables para el catalejo - definidas dentro del scope de load
    let catalejoActivo = false;
    let fov = { value: 55 }; // FOV inicial
    let initialZoom = { value: 0 }; // Zoom inicial
    let lastScrollPosition = 0; // Para detectar dirección del scroll
    let animacionIniciada = false; // Control para evitar iniciar la animación múltiples veces
    
    // Variables para control de tiempo de visualización de palabras
    let currentWordIndex = -1;
    let wordChangeTimestamp = 0;
    const MIN_WORD_DISPLAY_TIME = 1500; // Tiempo mínimo en milisegundos para mostrar cada palabra
    const FIRST_WORD_DISPLAY_TIME = 3000; // Tiempo especial para la primera palabra (3 segundos)
    let isFirstEntryToSection = true; // Flag para saber si es la primera vez que entramos en la sección
    let hasSeenFirstWord = false; // Flag para saber si ya se ha visto la primera palabra el tiempo mínimo
    let isWordChangeAllowed = true; // Controla si se permite cambiar de palabra
    let pendingWordIndex = -1; // Almacena la próxima palabra a mostrar en caso de scroll excesivo

    // Animación del texto introductorio con GSAP
    if (introText && scrollIndicator) {
        const timeline = gsap.timeline();
        timeline.to(introText, {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.5
        });
        timeline.from(introText.querySelector("h1"), {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "back.out"
        }, "-=0.5");
        timeline.from(introText.querySelector("p"), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.3");
        timeline.to(scrollIndicator, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.2");
    }

    // Función para iniciar la animación del catalejo de forma automática
    function iniciarAnimacionCatalejo() {
        // Mostrar el contenedor del catalejo
        gsap.to(spyglassContainer, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        });

        // Animación de entrada del catalejo
        if (spyglassInner) {
            // Resetear estilos iniciales
            gsap.set(spyglassInner, {
                scale: 0.8,
                opacity: 0,
                transformOrigin: 'center center',
                filter: 'blur(10px)'
            });

            // Animar los anillos concéntricos con retrasos escalonados
            const rings = document.querySelectorAll('.ring');
            rings.forEach((ring, i) => {
                gsap.fromTo(ring,
                    { scale: 0.5, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: 'elastic.out(1, 0.5)'
                    }
                );
            });

            // Animación principal del catalejo
            gsap.to(spyglassInner, {
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.2,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    spyglassInner.classList.add("active");
                    
                    // Animación de las marcas de medición
                    const ticks = document.querySelectorAll('.tick');
                    gsap.fromTo(ticks,
                        { scale: 0.5, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.6,
                            stagger: 0.05,
                            ease: 'back.out(2)'
                        }
                    );

                    // Animación del punto central
                    const crosshairDot = document.querySelector('.crosshair-dot');
                    if (crosshairDot) {
                        gsap.fromTo(crosshairDot,
                            { scale: 0, opacity: 0 },
                            {
                                scale: 1,
                                opacity: 1,
                                duration: 0.8,
                                ease: 'elastic.out(1, 0.5)'
                            }
                        );
                    }
                }
            });
        }

        // Secuencia de animación completa con timeline
        const timeline = gsap.timeline({
            onStart: () => {
                catalejoActivo = true;
                // Añadir clase al body para estilos específicos
                document.body.classList.add('spyglass-active');
            }
        });

        // Zoom continuo y fluido en una sola fase
        timeline.to(camera.position, {
            y: 5,
            z: 150,
            duration: 3,
            ease: "power2.inOut",
        }, 0);

        timeline.to(fov, {
            value: 2.5,
            duration: 3,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.fov = fov.value;
                camera.updateProjectionMatrix();
                camera.lookAt(0, 60, -9000);
                
                // Ajustar el brillo del catalejo según el zoom
                const progress = 1 - (fov.value - 5) / 50; // Normalizar entre 0 y 1
                const intensity = Math.min(progress * 1.5, 1);
                if (spyglassInner) {
                    spyglassInner.style.setProperty('--glow-intensity', intensity.toString());
                }
            }
        }, 0);

        // Efecto de parpadeo sutil
        timeline.to('.spyglass-reflection', {
            opacity: 0.3,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        }, 0);
    }

    // Función para resetear la animación del catalejo
    function resetearAnimacionCatalejo() {
        // Detener todas las animaciones GSAP activas
        gsap.killTweensOf(camera.position);
        gsap.killTweensOf(fov);
        gsap.killTweensOf('.spyglass-reflection');
        gsap.killTweensOf('.ring');
        gsap.killTweensOf('.tick');
        gsap.killTweensOf('.crosshair-dot');

        // Quitar clases de activación
        if (spyglassInner) {
            spyglassInner.classList.remove("active");
        }
        document.body.classList.remove('spyglass-active');

        // Animación de salida
        if (spyglassInner) {
            gsap.to(spyglassInner, {
                scale: 0.8,
                opacity: 0,
                duration: 0.5,
                ease: 'back.in(0.7)',
                onComplete: () => {
                    gsap.set(spyglassContainer, { opacity: 0 });
                }
            });
        } else {
            gsap.set(spyglassContainer, { opacity: 0 });
        }

        catalejoActivo = false;

        // Variables para el estado inicial y final de la cámara
        const progress = Math.min(window.scrollY / cameraAnimationEnd, 1);
        const startY = 100;
        const endY = 10;
        const startZ = 0;
        const endZ = 300;
        const targetY = startY + (endY - startY) * progress;
        const targetZ = startZ + (endZ - startZ) * progress;

        // Timeline para una transición fluida
        const resetTimeline = gsap.timeline();

        // Primero restaurar el FOV mientras mantenemos la inclinación
        resetTimeline.to(fov, {
            value: 30, // Valor intermedio de FOV
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.fov = fov.value;
                camera.updateProjectionMatrix();
                // IMPORTANTE: Mantener la misma inclinación durante el reseteo del zoom
                camera.lookAt(0, 60, -9000);
            }
        });

        // Segundo paso: restaurar completamente el FOV y mover la cámara
        resetTimeline.to(fov, {
            value: 55,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.fov = fov.value;
                camera.updateProjectionMatrix();
                // Transición suave del punto de mira
                const progress = 1 - (fov.value - 30) / 25; // Valor entre 0 y 1
                const lookAtY = 60 * progress; // Transición de 60 a 0
                camera.lookAt(0, lookAtY, -9000 * progress);
            }
        }, "+=0.1");

        // Tercer paso: restaurar completamente la posición y orientación
        resetTimeline.to(camera.position, {
            y: targetY,
            z: targetZ,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: () => {
                // Transición final de la mirada
                const progress = (camera.position.y - 5) / (targetY - 5);
                // Transición gradual desde mirar al faro a mirar al océano
                if (progress >= 0.7) {
                    camera.lookAt(0, 0, 0);
                } else {
                    camera.lookAt(0, 0, -9000 * (1 - progress));
                }
            }
        }, "-=0.5");
    }

    // Final message section animation
    const finalMessage = document.getElementById('final-message');
    const finalTextContainer = document.querySelector('.final-text-container');
    const finalText = document.querySelector('.final-text-immersive');
    
    if (finalMessage && finalText) {
        // Make sure the final message is at the end of the page
        const finalSection = document.createElement('div');
        finalSection.style.height = '100vh';
        finalSection.style.width = '100%';
        document.body.appendChild(finalSection);
        
        // Ensure final message is rendered flex
        gsap.set(finalMessage, { display: 'flex' });

        // Crear efecto de texto con letras separadas para animación
        const rawText = (finalText.textContent || '').trim();
        // No necesitamos manipular el texto aquí ya que ahora está estructurado en HTML
        
        // Mostrar mensaje completo con efecto de oleaje
        const showMessage = () => {
            if (finalMessage.classList.contains('visible')) return;
            finalMessage.classList.add('visible');
            
            // Mostrar el contenedor principal
            gsap.to(finalMessage, {
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out'
            });
            
            // Animar olas
            const waves = document.querySelectorAll('.wave');
            waves.forEach((wave, i) => {
                gsap.fromTo(wave, 
                    { scaleY: 0, opacity: 0 }, 
                    {
                        scaleY: 1, 
                        opacity: parseFloat((wave as HTMLElement).style.opacity || '0.2'),
                        duration: 1.2,
                        delay: 0.3 + (i * 0.1),
                        ease: 'power2.out'
                    }
                );
            });
        };

        // Ocultar mensaje con efecto inverso
        const hideMessage = () => {
            if (!finalMessage.classList.contains('visible')) return;
            
            // Ocultar el contenedor principal
            gsap.to(finalMessage, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                    finalMessage.classList.remove('visible');
                }
            });
            
            // Ocultar olas
            const waves = document.querySelectorAll('.wave');
            waves.forEach((wave, i) => {
                gsap.to(wave, {
                    scaleY: 0,
                    opacity: 0,
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: 'power2.in'
                });
            });
        };

        // Manejar visibilidad y efecto de desplazamiento lateral
        const visibilityHandler = () => {
            // Mostrar el mensaje final después del catalejo
            const scrollPosition = window.scrollY;
            const currentTime = Date.now();
            
            // Verificar si estamos en la sección del mensaje final
            const isInFinalMessageSection = scrollPosition >= finalMessageStart;
            
            if (isInFinalMessageSection) {
                showMessage();
                
                // Calcular el progreso dentro de la sección final para animar las palabras
                const progressInFinalSection = Math.min(
                    (scrollPosition - finalMessageStart) / finalMessageDuration, 
                    1
                );
                
                // Animar cada palabra individualmente basado en el progreso del scroll
                if (finalTextContainer) {
                    const words = document.querySelectorAll('.final-text-immersive .word');
                    if (words.length > 0) {
                        // Dividir el progreso total entre el número de palabras para calcular qué palabra está activa
                        const wordProgressIncrement = 1 / words.length;
                        
                        // Determinar qué palabra debería estar activa según el scroll
                        const targetWordIndex = Math.min(
                            Math.floor(progressInFinalSection / wordProgressIncrement), 
                            words.length - 1
                        );
                        
                        // Actualizar la pendiente si hay un scroll excesivo para mostrar después
                        if (targetWordIndex > currentWordIndex + 1) {
                            pendingWordIndex = targetWordIndex;
                        }
                        
                        // Comprobar si debemos cambiar la palabra activa
                        let activeWordIndex = currentWordIndex;
                        
                        // Si es la primera vez, activar la primera palabra y marcar su tiempo especial
                        if (currentWordIndex === -1) {
                            activeWordIndex = 0; // Forzar primera palabra
                            currentWordIndex = 0;
                            wordChangeTimestamp = currentTime;
                            isFirstEntryToSection = true;
                            hasSeenFirstWord = false;
                            isWordChangeAllowed = false;
                            
                            // Programar cuándo se permitirá el cambio de palabra
                            setTimeout(() => {
                                isWordChangeAllowed = true;
                                hasSeenFirstWord = true;
                            }, FIRST_WORD_DISPLAY_TIME);
                        }
                        // Si es la primera entrada y quieren saltarse la primera palabra
                        else if (isFirstEntryToSection && !hasSeenFirstWord && targetWordIndex > 0) {
                            // Mostrar el mensaje especial para la primera palabra
                            const firstWordMessage = document.querySelector('.first-word-message');
                            if (firstWordMessage) {
                                firstWordMessage.classList.add('visible');
                            }
                            
                            // Forzar que se siga mostrando la primera palabra
                            activeWordIndex = 0;
                            
                            // Actualizar la barra de progreso con el tiempo especial de la primera palabra
                            const progressBar = document.querySelector('.word-progress-bar');
                            if (progressBar) {
                                const timeElapsed = currentTime - wordChangeTimestamp;
                                const firstWordProgress = Math.min(
                                    timeElapsed / FIRST_WORD_DISPLAY_TIME,
                                    1
                                );
                                (progressBar as HTMLElement).style.width = `${firstWordProgress * 100}%`;
                            }
                        }
                        // Si queremos avanzar a la siguiente palabra Y ha pasado el tiempo mínimo Y se permite el cambio
                        else if (targetWordIndex > currentWordIndex && isWordChangeAllowed) {
                            // Solo permitir avanzar una palabra a la vez para asegurar tiempo mínimo de cada una
                            const nextWordIndex = currentWordIndex + 1;
                            activeWordIndex = nextWordIndex;
                            currentWordIndex = nextWordIndex;
                            wordChangeTimestamp = currentTime;
                            isFirstEntryToSection = false;
                            isWordChangeAllowed = false;
                            
                            // Ocultar el mensaje especial por si acaso
                            const firstWordMessage = document.querySelector('.first-word-message');
                            if (firstWordMessage) {
                                firstWordMessage.classList.remove('visible');
                            }
                            
                            // Programar cuándo se permitirá el cambio de palabra
                            setTimeout(() => {
                                isWordChangeAllowed = true;
                            }, MIN_WORD_DISPLAY_TIME);
                        }
                        // Si queremos ir a una palabra posterior pero no se permite aún
                        else if (targetWordIndex > currentWordIndex && !isWordChangeAllowed) {
                            // Mostrar mensaje de espera para palabras intermedias
                            const wordTimeMessage = document.querySelector('.word-time-message');
                            if (wordTimeMessage) {
                                wordTimeMessage.classList.add('visible');
                                
                                // Programar para ocultar el mensaje después de un breve tiempo
                                setTimeout(() => {
                                    wordTimeMessage.classList.remove('visible');
                                }, 2000); // Mostrar durante 2 segundos
                            }
                        }
                        // Si queremos ir a una palabra anterior, permitir inmediatamente
                        else if (targetWordIndex < currentWordIndex) {
                            // Permitir retroceder tantas palabras como sea necesario
                            activeWordIndex = targetWordIndex;
                            currentWordIndex = targetWordIndex;
                            wordChangeTimestamp = currentTime;
                            isWordChangeAllowed = true; // Siempre permitir cambios después de retroceder
                            
                            // Si vuelve a la primera palabra, reiniciar su estado
                            if (targetWordIndex === 0) {
                                hasSeenFirstWord = true; // Ya no forzar el tiempo de la primera palabra
                            } else {
                                isFirstEntryToSection = false;
                            }
                            
                            // Ocultar el mensaje especial
                            const firstWordMessage = document.querySelector('.first-word-message');
                            if (firstWordMessage) {
                                firstWordMessage.classList.remove('visible');
                            }
                        }
                        
                        // Actualizar la barra de progreso para palabras que no sean la primera
                        if (!(isFirstEntryToSection && !hasSeenFirstWord && activeWordIndex === 0)) {
                            // Si no se permite cambiar palabra, mostrar progreso
                            if (!isWordChangeAllowed) {
                                const progressBar = document.querySelector('.word-progress-bar');
                                if (progressBar) {
                                    const timeElapsed = currentTime - wordChangeTimestamp;
                                    const wordProgress = Math.min(
                                        timeElapsed / (activeWordIndex === 0 ? FIRST_WORD_DISPLAY_TIME : MIN_WORD_DISPLAY_TIME),
                                        1
                                    );
                                    (progressBar as HTMLElement).style.width = `${wordProgress * 100}%`;
                                }
                            }
                        }
                        
                        // Animar las palabras basándonos en la palabra activa
                        words.forEach((word, i) => {
                            const element = word as HTMLElement;
                            
                            // Calcular la visibilidad de esta palabra basada en el índice activo
                            if (i === activeWordIndex) {
                                // Esta palabra está activa
                                gsap.to(element, {
                                    opacity: 1,
                                    scale: 1,
                                    translateY: 0,
                                    translateX: 0,
                                    duration: 0.5
                                });
                                
                                // Efecto de animación dentro de la palabra activa
                                gsap.to(element, {
                                    scale: 1 + (0.05 * Math.sin(Math.PI * 0.5)), // Ligera pulsación
                                    duration: 0.2
                                });
                            } 
                            else if (i < activeWordIndex) {
                                // Palabras que ya se mostraron
                                gsap.to(element, {
                                    opacity: 0.2,
                                    scale: 0.8,
                                    translateY: "-50px",
                                    translateX: "-100vw",
                                    duration: 0.5
                                });
                            } 
                            else {
                                // Palabras que aún no se han mostrado
                                gsap.to(element, {
                                    opacity: 0,
                                    scale: 0.7,
                                    translateY: "50px",
                                    translateX: "100vw",
                                    duration: 0.5
                                });
                            }
                        });
                    }
                }
            } else {
                hideMessage();
                
                // Resetear el control de palabras cuando salimos de la sección
                currentWordIndex = -1;
                isFirstEntryToSection = true;
                hasSeenFirstWord = false;
                isWordChangeAllowed = true;
                pendingWordIndex = -1;
                
                // Ocultar mensajes
                const firstWordMessage = document.querySelector('.first-word-message');
                if (firstWordMessage) {
                    firstWordMessage.classList.remove('visible');
                }
                
                const wordTimeMessage = document.querySelector('.word-time-message');
                if (wordTimeMessage) {
                    wordTimeMessage.classList.remove('visible');
                }
                
                // Resetear la barra de progreso
                const progressBar = document.querySelector('.word-progress-bar');
                if (progressBar) {
                    (progressBar as HTMLElement).style.width = '0%';
                }
                
                // Resetear la posición de todas las palabras
                if (finalTextContainer) {
                    const words = document.querySelectorAll('.final-text-immersive .word');
                    words.forEach((word) => {
                        gsap.to(word, {
                            opacity: 0,
                            translateX: "100vw",
                            translateY: "100px",
                            scale: 0.9,
                            duration: 0.3
                        });
                    });
                }
            }
        };

        window.addEventListener('scroll', visibilityHandler);
        window.addEventListener('resize', visibilityHandler);
        // Initial state
        visibilityHandler();
    }

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const scrollDirection = scrollTop > lastScrollPosition ? 'down' : 'up';
        lastScrollPosition = scrollTop;
        const progress = Math.min(scrollTop / cameraAnimationEnd, 1);

        // Camera path: from top-down to horizon view
        if (!catalejoActivo) {
            const startY = 100;
            const endY = 10;
            const startZ = 0;
            const endZ = 300;

            camera.position.y = startY + (endY - startY) * progress;
            camera.position.z = startZ + (endZ - startZ) * progress;
            camera.lookAt(0, 0, 0);
        } else {
            // Mientras el catalejo está activo, mantener la inclinación hacia el faro
            camera.lookAt(0, 60, -9000);
        }

        // Animación de los textos
        if (scrollTop >= text1Start) {
            // Asegurar que el contenedor es visible cuando empezamos con los textos
            if (textContainer && textContainer.style.opacity !== "1") {
                gsap.to(textContainer, {
                    opacity: 1,
                    duration: 0.3
                });
            }

            // Primer texto - aparece y permanece más tiempo
            if (oceanText1) {
                const text1Progress = (scrollTop - text1Start) / (text1End - text1Start);

                if (text1Progress <= 0.8) {
                    // Aparecer gradualmente y subir lentamente
                    const opacity = Math.min(text1Progress * 2, 1);
                    const yOffset = 20 * (1 - Math.min(text1Progress * 1.5, 1));
                    const scrollOffset = text1Progress > 0.2 ? (text1Progress - 0.2) * -80 : 0; // Comienza a subir después del 20% de progreso

                    gsap.set(oceanText1, {
                        opacity: opacity,
                        y: yOffset + scrollOffset
                    });
                } else {
                    // Desaparecer más gradualmente cuando pasamos al segundo texto
                    const fadeOutProgress = Math.min((text1Progress - 0.8) / 0.2, 1);
                    gsap.set(oceanText1, {
                        opacity: Math.max(1 - fadeOutProgress, 0),
                        y: -80 * fadeOutProgress - 80 * 0.6 // Continúa subiendo mientras se desvanece
                    });
                }
            }

            // Segundo texto - aparece después del primero y permanece más tiempo
            if (oceanText2) {
                if (scrollTop >= text2Start) {
                    const text2Progress = (scrollTop - text2Start) / (text2End - text2Start);

                    if (text2Progress <= 0.9) { // Permanece visible por más tiempo
                        // Aparecer gradualmente y permitir más movimiento hacia arriba
                        const opacity = Math.min(text2Progress * 2, 1);
                        const yOffset = 20 * (1 - Math.min(text2Progress * 1.5, 1));
                        const scrollOffset = text2Progress > 0.1 ? (text2Progress - 0.1) * -120 : 0; // Mayor desplazamiento vertical

                        gsap.set(oceanText2, {
                            opacity: opacity,
                            y: yOffset + scrollOffset
                        });
                    } else {
                        // Desvanecer solo al final del recorrido
                        const fadeOutProgress = (text2Progress - 0.9) / 0.1;
                        gsap.set(oceanText2, {
                            opacity: Math.max(1 - fadeOutProgress, 0),
                            y: -120 * 0.8 - fadeOutProgress * 50 // Continúa subiendo mientras se desvanece
                        });
                    }
                } else {
                    // Asegurar que está oculto antes de su punto de aparición
                    gsap.set(oceanText2, {
                        opacity: 0,
                        y: 20
                    });
                }
            }
        } else {
            // Ocultar los textos si estamos por encima del punto de aparición
            if (textContainer) {
                gsap.to(textContainer, {
                    opacity: 0,
                    duration: 0.3
                });
            }
        }

        // Efecto catalejo después de los textos
        if (scrollTop >= spyglassStart) {
            // Mostrar contenedor de viñeta
            if (spyglassContainer && spyglassContainer.style.opacity !== "1") {
                gsap.to(spyglassContainer, {
                    opacity: 1,
                    duration: 0.3
                });
            }

            // Iniciar la animación automática del catalejo solo una vez
            if (!animacionIniciada) {
                animacionIniciada = true;
                iniciarAnimacionCatalejo();
            }
        } else {
            // Ocultar el catalejo cuando estamos por encima del punto de aparición
            if (spyglassContainer && spyglassContainer.style.opacity !== "0") {
                gsap.to(spyglassContainer, {
                    opacity: 0,
                    duration: 0.3
                });

                // Resetear la animación si volvemos arriba
                if (animacionIniciada) {
                    animacionIniciada = false;
                    resetearAnimacionCatalejo();
                }
            }
        }

        // Desvanecer texto introductorio y flecha al hacer scroll
        const fadeOutProgress = Math.min(scrollTop / (window.innerHeight * 0.3), 1);
        if (introText) {
            introText.style.opacity = String(1 - fadeOutProgress);
        }
        if (scrollIndicator) {
            scrollIndicator.style.opacity = String(1 - fadeOutProgress);
        }
    });
});