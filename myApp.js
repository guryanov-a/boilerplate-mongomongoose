require('dotenv').config();
const mongoose = require('mongoose');

const standardResultCallback = (done) => (err, data) => {
  if (err) {
    return done(err);
  }

  done(null, data);
};

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({ 
    name: 'John', 
    age: 28, 
    favoriteFoods: ['vegetables']
  });

  person.save(standardResultCallback(done));
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, standardResultCallback(done));
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, standardResultCallback(done));
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, standardResultCallback(done));
};

const findPersonById = (personId, done) => {
  return Person.findById(personId, standardResultCallback(done));
};

const foodToAdd = "hamburger";

const findEditThenSave = async (personId, done) => {
  let person;

  try {
    person = await Person.findById(personId);
  } catch (err) {
    done(err);
    return;
  }

  person.favoriteFoods.push(foodToAdd);

  try {
    await person.save();
  } catch (err) {
    done(err);
    return;
  };

  done(null, person);
};

const ageToSet = 20;

const findAndUpdate = async (personName, done) => {
  let person;

  try {
    person = await Person.findOneAndUpdate(
      { name: personName }, 
      { age: ageToSet }, 
      { new: true }
    );
  } catch (err) {
    done(err);
    return;
  }
  
  done(null, person);
};

const removeById = async (personId, done) => {
  let person;

  try {
    person = await Person.findByIdAndRemove(personId);
  } catch (err) {
    done(err);
    return;
  }

  done(null, person);
};

const nameToRemove = "Mary";

const removeManyPeople = async (done) => {
  let removedPeople;

  try {
    removedPeople = await Person.remove(
        { name: nameToRemove }
      );
  } catch (err) {
    done(err);
    return;
  }

  done(null, removedPeople);
};

const foodToSearch = "burrito";

const mainBurritoEatersQuery = Person
  .find(
    { favoriteFoods: foodToSearch }
  )
  .sort("name")
  .limit(2)
  .select('-age');

const queryChain = async (done) => {
  let mainBurritoEaters;

  try {
    mainBurritoEaters = await mainBurritoEatersQuery
      .exec();
  } catch (err) {
    done(err);
    return;
  }

  done(null, mainBurritoEaters);
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
