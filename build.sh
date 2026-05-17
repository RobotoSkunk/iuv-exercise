#!/bin/sh

echo "Compilando módulo de base de datos..."
cd modules/database
tsc

echo "Compilando módulo de chequeos..."
cd ../checkout
tsc

echo "Compilando módulo de autenticación..."
cd ../authentication
tsc

echo "Compilando módulo del cliente..."
cd ../frontend
npm run build

cd ../..
