.PHONY: sync-google-form

NEW_RELEASE_VERSION ?= 0.0.1

update:
	make cs-update
	make ts-update

cs-build:
	dotnet build ./Ironbug.Viewer.GH/Ironbug.Viewer.GH.csproj --configuration Release -f net48 /p:Version=$(NEW_RELEASE_VERSION) -o ./IbViewer /restore

cs-update:
	cd ./Ironbug.Viewer.GH && dotnet add Ironbug.Viewer.GH.csproj package PollinationBrowserControl
	
ts-install:
	cd ./ironbug-viewer && npm i

ts-dev:
	cd ./ironbug-viewer && npm run dev

ts-build:
	cd ./ironbug-viewer && npm run build

ts-build-gh-page:
	cd ./ironbug-viewer && npm run build:gh-page
