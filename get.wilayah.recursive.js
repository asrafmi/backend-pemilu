const axios = require('axios').default;
const fs = require('fs');
const path = require('path');

function writeData(p, data) {
  const dirWilayah = p.split('/')[0];
  const dir = p.split('/')[1];
  if (!fs.existsSync(`${dirWilayah}/${dir}`)) {
    fs.mkdirSync(`${dirWilayah}/${dir}`, { recursive: true });
  }
  fs.appendFileSync(path.join(__dirname, p), data + '\n', {
    encoding: 'utf-8',
  });
}

function serializeName(strName) {
  return strName.toLowerCase().replace(/ /g, '-');
}

function removeLevel(name) {
  return name
    .replace(/kabupaten-/g, '-')
    .replace(/kota-/g, '-')
    .replace(/kecamatan-/g, '-');
}

async function getProvinsi() {
  const { data } = await axios.get(
    'https://dev.farizdotid.com/api/daerahindonesia/provinsi'
  );
  return data.provinsi;
}

async function getKota(idProvinsi) {
  const { data } = await axios.get(
    `https://dev.farizdotid.com/api/daerahindonesia/kota?id_provinsi=${idProvinsi}`
  );
  return data.kota_kabupaten;
}

async function getKecamatan(idKota) {
  const { data } = await axios.get(
    `https://dev.farizdotid.com/api/daerahindonesia/kecamatan?id_kota=${idKota}`
  );
  return data.kecamatan;
}

async function main() {
  const dataProvinsi = await getProvinsi();
  for (const dp of dataProvinsi) {
    const dataKota = await getKota(dp.id);
    for (const dk of dataKota) {
      const dataKecamatan = await getKecamatan(dk.id);
      console.log('kota', dk.nama);
      for (const dkc of dataKecamatan) {
        console.log('kecamatan', dkc.nama);
        writeData(
          `wilayah/${removeLevel(serializeName(dp.nama))}/${serializeName(
            dk.nama
          )}.txt`,
          serializeName(dkc.nama)
        );
      }
    }
  }
}

main();
