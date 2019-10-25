import fse from 'fs-extra'

(async () => {
  await fse.copyFile('src/share/type.d.ts', 'lib/share/type.d.ts');
  await fse.copyFile('src/client/type.d.ts', 'lib/client/type.d.ts');
  await fse.copyFile('src/server/type.d.ts', 'lib/server/type.d.ts');
  console.log(`File copied:
    share/type.d.ts
    client/type.d.ts
    server/type.d.ts
  `);
})();