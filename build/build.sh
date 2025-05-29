#!/bin/bash

# Créer le répertoire build s'il n'existe pas
mkdir -p build

# Copier les fichiers HTML du dossier pages vers build
cp -R pages/* build/

# Copier les images
cp -R images build/

# Copier les styles
cp -R styles build/

# Copier les api
cp -R api build/