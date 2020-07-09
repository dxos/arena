# !/usr/bin/env sh

# TODO(ashwin): Check for compatible platform, arch and system node version.

PACKAGE_BIN_DIR="out/bin"
PACKAGE_BUILD_DIR="out/builds"
PACKAGE_DIST_DIR="out/dist"

PLATFORM_ARCH="$1"
DIST_FILE_NAME="$2"

if [ -z "${PLATFORM_ARCH}" ]; then
  echo "Missing platform/arch." && exit
fi

# Distribution file name defaults to platform/arch setting.
if [ -z "${DIST_FILE_NAME}" ]; then
  DIST_FILE_NAME="${PLATFORM_ARCH}"
fi

rm -rf "${PACKAGE_BUILD_DIR}"
rm -rf "${PACKAGE_DIST_DIR}"

mkdir -p "${PACKAGE_DIST_DIR}"
mkdir -p "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds"

case $PLATFORM_ARCH in
  macos-x64 )
    cp -r ../../node_modules/leveldown/prebuilds/darwin-x64/. "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds/darwin-x64/"
    cp -r ../../node_modules/sodium-native/prebuilds/darwin-x64/. "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds/darwin-x64/"
    ;;

  linux-x64 )
    cp -r ../../node_modules/leveldown/prebuilds/linux-x64/. "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds/linux-x64/"
    cp -r ../../node_modules/sodium-native/prebuilds/linux-x64/. "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds/linux-x64/"
    ;;

  linux-armv7 )
    cp -r ../../node_modules/leveldown/prebuilds/linux-arm/. "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds/linux-arm"
    cp -r ../../node_modules/sodium-native/prebuilds/linux-arm/. "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/prebuilds/linux-arm"
    ;;

  * )
    echo "Unsupported platform/arch: ${PLATFORM_ARCH}" && exit
esac

cp ../../node_modules/wrtc/build/Release/wrtc.node "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/"

cp "${PACKAGE_BIN_DIR}/main-${PLATFORM_ARCH}" "${PACKAGE_BUILD_DIR}/${PLATFORM_ARCH}/main.bin"

tar -czf "${PACKAGE_DIST_DIR}/${DIST_FILE_NAME}.tgz" -C "out/builds/${PLATFORM_ARCH}" .
