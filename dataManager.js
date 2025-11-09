const DataManager = {
    // Claves de localStorage
    KEYS: {
        MEDICOS: 'centroMedico_medicos',
        ESPECIALIDADES: 'centroMedico_especialidades',
        OBRAS_SOCIALES: 'centroMedico_obrasSociales'
    },

    // Datos iniciales por defecto
    DEFAULTS: {
        ESPECIALIDADES: [
            { id: 1, nombre: "Cardiología", activo: true },
            { id: 2, nombre: "Neurología", activo: true },
            { id: 3, nombre: "Pediatría", activo: true },
            { id: 4, nombre: "Medicina General", activo: true },
            { id: 5, nombre: "Traumatología", activo: true },
            { id: 6, nombre: "Ginecología", activo: true },
            { id: 7, nombre: "Oftalmología", activo: true },
            { id: 8, nombre: "Dermatología", activo: true },
            { id: 9, nombre: "Psiquiatría", activo: true },
            { id: 10, nombre: "Endocrinología", activo: true },
            { id: 11, nombre: "Gastroenterología", activo: true },
            { id: 12, nombre: "Urología", activo: true }
        ],
        OBRAS_SOCIALES: [
            {
                id: 1,
                nombre: "OSDE",
                descripcion: "Organización de Servicios Directos Empresarios. Una de las principales obras sociales privadas de Argentina con amplia cobertura nacional.",
                porcentaje: 15,
                imagen: "",
                activo: true
            },
            {
                id: 2,
                nombre: "Swiss Medical",
                descripcion: "Medicina prepaga con cobertura integral y amplia red de prestadores en todo el país.",
                porcentaje: 20,
                imagen: "",
                activo: true
            },
            {
                id: 3,
                nombre: "Galeno",
                descripcion: "Sistema de medicina prepaga con planes personalizados y atención de alta calidad.",
                porcentaje: 18,
                imagen: "",
                activo: true
            },
            {
                id: 4,
                nombre: "PAMI",
                descripcion: "Instituto Nacional de Servicios Sociales para Jubilados y Pensionados. Cobertura para adultos mayores.",
                porcentaje: 25,
                imagen: "",
                activo: true
            },
            {
                id: 5,
                nombre: "IOMA",
                descripcion: "Instituto de Obra Médico Asistencial. Obra social de la provincia de Buenos Aires.",
                porcentaje: 22,
                imagen: "",
                activo: true
            },
            {
                id: 6,
                nombre: "Unión Personal",
                descripcion: "Obra social del personal de las telecomunicaciones con cobertura en todo el territorio nacional.",
                porcentaje: 12,
                imagen: "",
                activo: true
            },
            {
                id: 7,
                nombre: "Medifé",
                descripcion: "Medicina prepaga con diversos planes de cobertura y atención personalizada.",
                porcentaje: 16,
                imagen: "",
                activo: true
            },
            {
                id: 8,
                nombre: "OSECAC",
                descripcion: "Obra Social de Empleados de Comercio y Actividades Civiles. Una de las obras sociales sindicales más grandes.",
                porcentaje: 20,
                imagen: "",
                activo: true
            }
        ],
        MEDICOS: [
            {
                id: 1,
                matricula: 12345,
                apellido: "González",
                nombre: "María",
                descripcion: "Especialista en cardiología con más de 15 años de experiencia. Graduada de la Universidad de Buenos Aires, con especialización en cardiología intervencionista.",
                especialidades: [1],
                obrasSociales: [1, 2, 4],
                fotografia: "",
                valorConsulta: 15000.00,
                telefono: "+54 11 4567-8901",
                email: "maria.gonzalez@centromedico.com",
                activo: true
            },
            {
                id: 2,
                matricula: 23456,
                apellido: "Rodríguez",
                nombre: "Juan",
                descripcion: "Neurólogo especializado en enfermedades neurodegenerativas. Doctorado en Neurociencias por la Universidad Nacional de Córdoba.",
                especialidades: [2],
                obrasSociales: [1, 3, 5],
                fotografia: "",
                valorConsulta: 18000.00,
                telefono: "+54 11 4567-8902",
                email: "juan.rodriguez@centromedico.com",
                activo: true
            },
            {
                id: 3,
                matricula: 34567,
                apellido: "Fernández",
                nombre: "Ana",
                descripcion: "Pediatra con vocación por la atención infantil. Más de 10 años de experiencia en pediatría general y vacunación.",
                especialidades: [3],
                obrasSociales: [1, 2, 4, 5, 8],
                fotografia: "",
                valorConsulta: 12000.00,
                telefono: "+54 11 4567-8903",
                email: "ana.fernandez@centromedico.com",
                activo: true
            },
            {
                id: 4,
                matricula: 45678,
                apellido: "López",
                nombre: "Carlos",
                descripcion: "Médico clínico con amplia experiencia en atención primaria. Enfoque integral en medicina preventiva.",
                especialidades: [4],
                obrasSociales: [1, 4, 5, 6, 8],
                fotografia: "",
                valorConsulta: 10000.00,
                telefono: "+54 11 4567-8904",
                email: "carlos.lopez@centromedico.com",
                activo: true
            },
            {
                id: 5,
                matricula: 56789,
                apellido: "Martínez",
                nombre: "Laura",
                descripcion: "Traumatóloga especializada en cirugía de columna y rehabilitación deportiva.",
                especialidades: [5],
                obrasSociales: [1, 2, 3],
                fotografia: "",
                valorConsulta: 16000.00,
                telefono: "+54 11 4567-8905",
                email: "laura.martinez@centromedico.com",
                activo: false
            }
        ]
    },

    // Inicializar datos desde localStorage o usar defaults
    init() {
        // Solo cargar defaults si NO existe en localStorage
        if (!localStorage.getItem(this.KEYS.ESPECIALIDADES)) {
            this.saveEspecialidades(this.DEFAULTS.ESPECIALIDADES);
        }
        if (!localStorage.getItem(this.KEYS.OBRAS_SOCIALES)) {
            this.saveObrasSociales(this.DEFAULTS.OBRAS_SOCIALES);
        }
        if (!localStorage.getItem(this.KEYS.MEDICOS)) {
            this.saveMedicos(this.DEFAULTS.MEDICOS);
        }
    },

    // ESPECIALIDADES
    getEspecialidades() {
        const data = localStorage.getItem(this.KEYS.ESPECIALIDADES);
        return data ? JSON.parse(data) : [];
    },

    saveEspecialidades(especialidades) {
        localStorage.setItem(this.KEYS.ESPECIALIDADES, JSON.stringify(especialidades));
    },

    deleteEspecialidad(id) {
        // No eliminar del array, solo marcar como inactiva si existe
        const especialidades = this.getEspecialidades();
        const especialidadIndex = especialidades.findIndex(e => e.id === id);
        
        if (especialidadIndex !== -1) {
            especialidades[especialidadIndex].activo = false;
            this.saveEspecialidades(especialidades);
        }
        
        // Actualizar médicos: remover especialidad y verificar si quedan sin especialidades
        const medicos = this.getMedicos();
        const medicosActualizados = medicos.map(m => {
            if (m.especialidades && m.especialidades.includes(id)) {
                const nuevasEspecialidades = m.especialidades.filter(espId => espId !== id);
                
                // Si no quedan especialidades, dar de baja
                if (nuevasEspecialidades.length === 0) {
                    return { ...m, especialidades: [], activo: false };
                }
                
                return { ...m, especialidades: nuevasEspecialidades };
            }
            return m;
        });
        this.saveMedicos(medicosActualizados);
    },

    // OBRAS SOCIALES
    getObrasSociales() {
        const data = localStorage.getItem(this.KEYS.OBRAS_SOCIALES);
        return data ? JSON.parse(data) : [];
    },

    saveObrasSociales(obrasSociales) {
        localStorage.setItem(this.KEYS.OBRAS_SOCIALES, JSON.stringify(obrasSociales));
    },

    deleteObraSocial(id) {
        // No eliminar del array, solo marcar como inactiva si existe
        const obrasSociales = this.getObrasSociales();
        const obraSocialIndex = obrasSociales.findIndex(os => os.id === id);
        
        if (obraSocialIndex !== -1) {
            obrasSociales[obraSocialIndex].activo = false;
            this.saveObrasSociales(obrasSociales);
        }
        
        // Actualizar médicos: remover obra social de los médicos que la tengan
        const medicos = this.getMedicos();
        const medicosActualizados = medicos.map(m => {
            if (m.obrasSociales && m.obrasSociales.includes(id)) {
                return {
                    ...m,
                    obrasSociales: m.obrasSociales.filter(osId => osId !== id)
                };
            }
            return m;
        });
        this.saveMedicos(medicosActualizados);
    },

    // MÉDICOS
    getMedicos() {
        const data = localStorage.getItem(this.KEYS.MEDICOS);
        return data ? JSON.parse(data) : [];
    },

    saveMedicos(medicos) {
        localStorage.setItem(this.KEYS.MEDICOS, JSON.stringify(medicos));
    },

    // Limpiar especialidades y obras sociales inactivas de los médicos
    limpiarMedicosInactivos() {
        const medicos = this.getMedicos();
        const especialidades = this.getEspecialidades();
        const obrasSociales = this.getObrasSociales();
        
        const medicosLimpios = medicos.map(medico => {
            // Filtrar especialidades inactivas
            const especialidadesActivas = (medico.especialidades || []).filter(espId => {
                const esp = especialidades.find(e => e.id === espId);
                return esp && (esp.activo === true || esp.activo === undefined);
            });
            
            // Filtrar obras sociales inactivas
            const obrasSocialesActivas = (medico.obrasSociales || []).filter(osId => {
                const os = obrasSociales.find(o => o.id === osId);
                return os && (os.activo === true || os.activo === undefined);
            });
            
            // Si no tiene especialidades activas, desactivar médico
            const activo = especialidadesActivas.length > 0 ? medico.activo : false;
            
            return {
                ...medico,
                especialidades: especialidadesActivas,
                obrasSociales: obrasSocialesActivas,
                activo: activo
            };
        });
        
        this.saveMedicos(medicosLimpios);
        return medicosLimpios;
    },

    // Limpiar todos los datos (útil para desarrollo/testing)
    clearAll() {
        localStorage.removeItem(this.KEYS.MEDICOS);
        localStorage.removeItem(this.KEYS.ESPECIALIDADES);
        localStorage.removeItem(this.KEYS.OBRAS_SOCIALES);
    },

    // Resetear a valores por defecto
    reset() {
        this.clearAll();
        this.init();
    }
};

// Inicializar al cargar
DataManager.init();