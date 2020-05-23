import { HandlerFunc, Context } from "abc";
import db from "../config/db.ts";

// DB collection made
const database = db.getDatabase;
const dogs = database.collection("dogs");

// Dog type defined
interface Dog {
  _id: {
    $oid: string;
  };
  name: string;
  age: string;
}

export const create: HandlerFunc = async (c: Context) => {
  try {
    const body = await c.body();
    if (!Object.keys(body).length) {
      return c.string("Request can't be empty", 400);
    }
    const { name, age } = body;

    const insertedDog = await dogs.insertOne({
      name,
      age,
    });

    return c.json(insertedDog, 201);
  } catch (error) {
    return c.json(error, 500);
  }
};

export const fetchAll: HandlerFunc = async (c: Context) => {
  try {
    const fetchedDogs: Array<Dog> = await dogs.find();

    if (fetchedDogs) {
      const fetchedDogsList = fetchedDogs.length
        ? fetchedDogs.map((dog) => {
            const {
              _id: { $oid },
              name,
              age,
            } = dog;
            return { id: $oid, name, age };
          })
        : [];
      return c.json(fetchedDogsList, 200);
    }
  } catch (error) {
    return c.json(error, 500);
  }
};

export const fetchOne: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedDog = await dogs.findOne({ _id: { $oid: id } });

    if (fetchedDog) {
      const {
        _id: { $oid },
        name,
        age,
      } = fetchedDog;
      return c.json({ id: $oid, name, age }, 200);
    }
    return c.string("Dog not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};

export const update: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const body = (await c.body()) as {
      name?: string;
      age?: string;
    };

    if (!Object.keys(body).length) {
      return c.string("Request can't be empty", 400);
    }

    const fetchedDog = await dogs.findOne({ _id: { $oid: id } });

    if (fetchedDog) {
      const { matchedCount } = await dogs.updateOne(
        { _id: { $oid: id } },
        { $set: body }
      );
      if (matchedCount) {
        return c.string("Dog updated successfully!", 204);
      }
      return c.string("Unable to update dog");
    }

    return c.string("Dog not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};

export const deleteDog: HandlerFunc = async (c: Context) => {
  try {
    const { id } = c.params as { id: string };

    const fetchedDog = await dogs.findOne({ _id: { $oid: id } });

    if (fetchedDog) {
      const deleteCount = await dogs.deleteOne({ _id: { $oid: id } });

      if (deleteCount) {
        return c.string("Dog deleted successfully!", 204);
      }
      return c.string("Unable to delete dog");
    }

    return c.string("Dog not found", 404);
  } catch (error) {
    return c.json(error, 500);
  }
};
