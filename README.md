# Sistema de chequeo de entradas y salidas para personal docente

## Estructura de archivos

Todos los microservicios se encuentran dentro del directorio `modules`, cada uno
en el directorio con el nombre del módulo correspondiente.

La estructura actual del proyecto es la siguiente.

```txt
.
├── database-schema.drawio
├── modules
│   ├── authentication
│   ├── checkout
│   ├── database
│   └── frontend
├── prepare.sh
└── README.md
```


## Requisitos
- Sistema operativo basado en Unix
- Node.js >= 24
- PostgreSQL >= 18

Además del software listado previamente, se debe instalar un paquete global para
compilar TypeScript.

```bash
npm i -g typescript
```

## Preparación

Primero se ejecuta el siguiente comando en el directorio raíz del proyecto
para instalar todos los paquetes necesarios de los módulos del proyecto.

```bash
sh ./prepare.sh
```

Cada módulo tiene su configuración individual, para configurarlos, se debe
duplicar el archivo `example.env` que se encuentra en cada uno de los módulos
del proyecto y renombrarlo a `.env`.

Por ejemplo.

```bash
cd modules/database
cp example.env .env
vi .env
```

## Ejecución

Debido a que no existe un script que ejecute el proyecto completo de golpe,
se debe ejecutar cada módulo por separado.

A continuación, se listan los módulos disponibles para su ejecución.

### Ejecución del módulo `database`

Este es el módulo más importante del proyecto, debido a que todas las
operaciones con la base de datos se realizan aquí. Sin este módulo, el resto de
módulos no operarán.

```bash
cd module/database

# Compilación
tsc

# Ejecución
node
```

### Ejecución del módulo `checkout`

Asumiendo que se encuentra en el directorio raíz del proyecto, estos son los
pasos para compilar y ejecutar el módulo.

```bash
cd module/checkout

# Compilación
tsc

# Ejecución
node
```

Por ahora, el código de `checkout` es demasiado simple, puesto a que es parte de
la primera iteración del proyecto.

## Diagrama de clases

![Diagrama de clases](assets/UML.svg) 

Las clases del diagrama se encuentran implementados en el módulo `database` en
el directorio [src/entities](modules/database/src/entities) del módulo.

## Extensiones recomendadas para Visual Studio Code

Una extensión recomendada para ejecutar pruebas con los módulos es
[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client),
esta extensión sirve para realizar peticiones HTTP a cada módulo sin necesidad
de programas de terceros como Postman.

Dentro del directorio de cada ḿodulo, se encuentra un archivo `tests.http` que
se usó con dicha extensión para realizar las pruebas de funcionamiento de cada
módulo.
