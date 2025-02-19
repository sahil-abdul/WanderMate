const mongoose = require("mongoose");
const listing = require("../modul/listing.js")
const initData = require("./data.js")

main()
 .then((res) => {
  console.log("connected to database");
 })
 .catch((err) => {
    console.log(err)
 });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderMate");
}

let addingData = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((e) => ({...e,owner:"67ac21b4dad7ab1cc603771c"}));
    initData.data = initData.data.map((e) => ({...e,category:"OMG"}));
    await listing.insertMany(initData.data);
}

addingData();