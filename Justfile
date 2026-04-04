set windows-shell := ["cmd", "/c"]

install:
    npm install

dev:
    npm run start

lint:
    npx prettier --check **/*.{js,md}

lint_fix:
    npx prettier --write **/*.{js,md}

bede_build:
    python ./writing/bede/build.py
