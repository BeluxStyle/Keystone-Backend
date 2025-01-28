//delete: ({ session }) => !!session?.data,
import { list, graphql } from '@keystone-6/core'
import { allOperations, allowAll } from '@keystone-6/core/access'
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  virtual,
} from '@keystone-6/core/fields'
//import { checkRoleLevel } from './hooks/user-hook';



export const lists = {
  Admin: list({
    ui: {
      isHidden: true
    },
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      agente: integer(),
    },
  }),

  Categoria: list({
    ui: {
      isHidden: true
    },
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
    },
  }),


  Comunidad: list({
    ui: {
      label: 'Comunidades',
      
    },
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      direccion: text(),
      cp: integer(),
      admin: relationship({ ref: 'Admin', many: false }),
      cif: text(),
      author: relationship({ ref: 'User', many: false }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
      edificios: relationship({ ref: 'Edificio.comunidad', many: true }),
    },
  }),

  Contacto: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text(),
      telefono: text(),
      piso: text(),
      edificio: relationship({ ref: 'Edificio', many: false }),
      comunidad: relationship({ ref: 'Comunidad', many: false }),
      tipo: select({
        options: ['vecino', 'mantenedor', 'presidente'],
        defaultValue: 'vecino',
      }),
    },
  }),

  Documento: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      archivo: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  Edificio: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ validation: { isRequired: true } }),
      comunidad: relationship({ ref: 'Comunidad.edificios' }),
      instalaciones: relationship({ ref: 'Instalacion.edificio', many: true }),
      tipo: select({
        options: ['bloque', 'acceso'],
        defaultValue: 'bloque',
      }),
      admin: relationship({ ref: 'Admin', many: false }),
      label: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: any, args, context) {
            if (!item.comunidadId) return item.name; // Change item.marca to item.marcaId
            const comunidad = await context.db.Comunidad.findOne({
              where: { id: item.comunidadId }, // Change item.marca to item.marcaId
            });
            return `${comunidad?.name || ''} - ${item.name}`;
          },
        }),
      }),
    },
  }),

  Elemento: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      producto: relationship({ ref: 'Producto', many: false }),
      estado: select({
        options: ['averiado', 'reparado', 'ok'],
        defaultValue: 'ok',
      }),
      instalacion: relationship({ ref: 'Instalacion.elementos' }),
      cantidad: integer({ defaultValue: 1 }),
      observaciones: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
      group: select({
        options: ['placa', 'terminales', 'rfid', 'otros'],
        defaultValue: 'otros',
      }),
    },
  }),

  Empresa: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text(),
      logo: text(),
      cif: text(),
    },
  }),

  Imagen: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      archivo: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  Manual: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      producto: relationship({ ref: 'Producto', many: false }),
      documento: relationship({ ref: 'Documento', many: false }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  Marca: list({
    ui: {
      isHidden: true
    },
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text(),
      categoria: relationship({ ref: 'Categoria', many: false }),
    },
  }),

  Instalacion: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      tipo: select({
        options: ['portero', 'antena', 'electricidad', 'contraincendios', 'cerrajeria', 'automatismos', 'cctv', 'otros'],
        defaultValue: 'portero',
      }),
      descripcion: text(),
      edificio: relationship({ ref: 'Edificio.instalaciones' }),
    elementos: relationship({ ref: 'Elemento.instalacion', many: true }),
    comentarios: relationship({ ref: 'InstalacionComment.instalacion', many: true }),
    },
  }),

  Contraincendio: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      serial_number: text(),
      date_made: timestamp(),
      date_retimbrado: timestamp(),
      date_last_revision: timestamp(),
      date_next_revision: timestamp(),
      tecnico: relationship({ ref: 'User', many: false }),
      descripcion: text(),
      elemento: relationship({ ref: 'Elemento', many: false }),
    },
  }),

  Inst_Otro: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      serial_number: text(),
      date_made: timestamp(),
      date_last_revision: timestamp(),
      date_next_revision: timestamp(),
      elemento: relationship({ ref: 'Elemento', many: false }),
      tecnico: relationship({ ref: 'User', many: false }),
    },
  }),

  Reparacion: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      date_repair: timestamp(),
      tecnico: relationship({ ref: 'User', many: false }),
      descripcion: text(),
      elemento: relationship({ ref: 'Elemento', many: false }),
    },
  }),

  Producto: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      ref: text({ label: 'Referencia', validation: { isRequired: true } }),
      descripcion: text(),
      categoria: relationship({
        ref: 'Categoria',
        many: false,
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          linkToItem: true,
          inlineCreate: { fields: ['name'] },
          inlineEdit: { fields: ['name'] },
          inlineConnect: true,
        }
      }),
      subcategoria: relationship({
        ref: 'Subcategoria',
        many: false,
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          linkToItem: true,
          inlineCreate: { fields: ['name'] },
          inlineEdit: { fields: ['name'] },
          inlineConnect: true,
        }
      }),
      marca: relationship({
        ref: 'Marca',
        many: false,
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          linkToItem: true,
          inlineCreate: { fields: ['name'] },
          inlineEdit: { fields: ['name'] },
          inlineConnect: true,
        }
      }),
      precio: integer({ label: 'Precio (€)', validation: { isRequired: false } }),
      ean: text({ label: 'EAN 13', validation: { isRequired: false } }),
      imagen: relationship({ ref: 'Imagen', many: false }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
      label: virtual({
        field: graphql.field({
          type: graphql.String,
          async resolve(item: any, args, context) {
            if (!item.marcaId) return item.ref; // Change item.marca to item.marcaId
            const marca = await context.db.Marca.findOne({
              where: { id: item.marcaId }, // Change item.marca to item.marcaId
            });
            return `${marca?.name || ''} - ${item.ref}`;
          },
        }),
        ui: {
          description: 'Etiqueta combinada de Marca y Referencia',
        },
      }),
    },
    ui: {
      labelField: 'label', // Usar el campo virtual como etiqueta
    },
  }),
  Rol: list({
    ui: {
      isHidden: true
    },
    access: {
      operation: {
        query: allowAll,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ label: 'Nombre' }),
      level: integer({ label: 'Nivel' }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
      deletedAt: timestamp(),
      users: relationship({
        ref: 'User.rol',
        many: true,
      }),
    },
  }),

  Subcategoria: list({
    ui: {
      isHidden: true
    },
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({ label: 'Nombre' }),
      categoria: relationship({ ref: 'Categoria', many: false }),
    },
  }),

  Telefonillo: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      modelo: text(),
      abrep: text(),
      micro: text(),
      comun: text(),
      altavoz: text(),
      llamada: text(),
    },
  }),

  // En el User list
  User: list({
    access: {
      operation: {
        query: allowAll,
        create: allowAll,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text({
        validation: { isRequired: true },
        label: 'Nombre'
      }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        label: 'Correo electrónico'
      }),
      password: password({
        label: 'Contraseña'
      }),
      googleId: text({ isIndexed: 'unique' }),
      photo: text({
        label: 'Foto de perfil'
      }),
      lastLogin: timestamp({
        label: 'Último acceso'
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
        label: 'Fecha de creación'
      }),
      updatedAt: timestamp({
        defaultValue: { kind: 'now' },
        label: 'Última actualización'
      }),
      profile: relationship({
        ref: 'Profile.user',
        ui: {
          displayMode: 'cards',
          cardFields: ['bio'],
          inlineEdit: {
            fields: ['bio']
          },
          linkToItem: true
        }
      }),
      empresa: relationship({
        ref: 'Empresa',
        many: false,
        label: 'Empresa'
      }),
      rol: relationship({
        ref: 'Rol.users',
        many: false,
        label: 'Rol'
      }),
      tecnicoNum: integer({
        label: 'ID del técnico'
      }),
      token: text({
        label: 'Token'
      }),
    },
  }),
  Aviso: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      numero: text({ validation: { isRequired: true } }),
      comunidad: relationship({ ref: 'Comunidad', many: false }),
      tecnico: relationship({ ref: 'User', many: false }),
      solucion: text(),
      observaciones: text(),
      status: select({
        options: ['Pendiente', 'En Proceso', 'Finalizado'],
        defaultValue: 'Pendiente',
      }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),

    },
  }),
  History: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      aviso: relationship({ ref: 'Aviso', many: false }),
      tecnico: relationship({ ref: 'User', many: false }),
      status: select({
        options: ['Pendiente', 'En Proceso', 'Finalizado'],
        defaultValue: 'Pendiente',
      }),
      observaciones: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),

    },
  }),
  Adjunto: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      aviso: relationship({ ref: 'Aviso', many: false }),
      url: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),

    },
  }),

  Profile: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      user: relationship({ ref: 'User.profile', many: false }),
      bio: text(),
      photo: text(),
      phone: text(),
      workPhone: text(),
    },
  }),

  EdificioComment: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      author: relationship({ ref: 'User', many: false }),
      edificio: relationship({ ref: 'Edificio', many: false }),
      comentario: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  AvisoComment: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      author: relationship({ ref: 'User', many: false }),
      aviso: relationship({ ref: 'Aviso', many: false }),
      comentario: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  ElementoComment: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      author: relationship({ ref: 'User', many: false }),
      elemento: relationship({ ref: 'Elemento', many: false }),
      comentario: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  InstalacionComment: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      author: relationship({ ref: 'User', many: false }),
      instalacion: relationship({ ref: 'Instalacion.comentarios' }),
      comentario: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  Subcription: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      name: text(),
      limits: integer(),
      price: integer(),
      description: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  SubscriptionEmpresa: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      empresa: relationship({ ref: 'Empresa', many: false }),
      subscription: relationship({ ref: 'Subcription', many: false }),
      expiration: timestamp(),
      status: select({
        options: ['active', 'expired'],
        defaultValue: 'active',
      }),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),

  Config: list({
    access: {
      operation: {
        query: ({ session }) => !!session?.data,
        create: ({ session }) => !!session?.data,
        update: ({ session }) => !!session?.data,
        delete: ({ session }) => !!session?.data,
      },
    },
    fields: {
      key: text(),
      value: text(),
      createdAt: timestamp({ defaultValue: { kind: 'now' } }),
      updatedAt: timestamp({ defaultValue: { kind: 'now' } }),
    },
  }),


}


