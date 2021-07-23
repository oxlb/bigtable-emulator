// Imports the Google Cloud client library
require('dotenv').config();
const Bigtable = require('@google-cloud/bigtable');

const TABLE_NAME = 'test_table';
const COLUMNS = ['column1', 'column2', 'column3'];

function getBigTableInstance() {
	// Load Bigtable Instance
	const bigtableOptions = {
		projectId: process.env.GCP_PROJECT_ID,
		keyFilename: process.env.CBT_KEY
	};

	const bigtable = new Bigtable(bigtableOptions);

	return bigtable.instance(process.env.CBT_INSTANCE);
}

const bigTableInstance  = getBigTableInstance();

const table = bigTableInstance.table(TABLE_NAME);

async function createTable() {
    const response = await bigTableInstance.createTable(TABLE_NAME);
    return response;
}

async function quickTest() {
  const data = await createTable();
  console.log(data)
  for(let i=0; i<COLUMNS.length; i++){
    await table.createFamily(COLUMNS[i], { rule: { versions: 2 }});
  }
}


(async() => {
  try {
    await quickTest();
    let families = await table.getFamilies()
    families.forEach(e=>console.log(e));
  } catch(err) {
      console.error(err);
  }
})();