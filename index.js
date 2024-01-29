const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :req[content] - :response-time ms"
  )
);

morgan.token("type", function (req, res) {
  return req.headers["content"];
});

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (req, res) => {
  res.send(data);
});

app.get("/info", (req, res) => {
  const noOfPeople = data.length;
  const date = new Date();
  res.send(
    ` <h1>Phonebook has informatioin of ${noOfPeople} peoples</h1>
      <br />
      <h1>${date}</h1>
    `
  );
});

app.get("/api/person/:id", (req, res) => {
  const id = req.params.id;
  console.log(typeof id);

  const phonebook = data.find((d) => d.id === Number(id));

  if (phonebook) {
    res.json(phonebook);
  } else {
    res.status(404).send(`<h1>Data not found</h1>`);

    // return ;
  }
});

app.delete("/api/person/:id", (req, res) => {
  const id = req.params.id;

  const checkId = data.find((d) => d.id === Number(id));
  console.log(checkId, data);

  if (checkId) {
    data = data.filter((d) => d.id !== Number(id));
    console.log(data);

    res.status(202).send("successfully Updated");
  } else {
    res.status(404).send("data not found");
  }
});

app.post("/api/person", (req, res) => {
  const generateId = () => {
    const maxid = data.length > 0 ? Math.max(...data.map((n) => n.id)) : 0;
    return maxid + 1;
  };

  const newPhonebook = req.body;
  console.log(newPhonebook);

  if (!newPhonebook.name || !newPhonebook.phone) {
    if (newPhonebook.name.length === 0 && newPhonebook.phone.length === 0) {
      res.status(204).send("<h1>name and Phone is empty");
    } else if (newPhonebook.phone.length === 0) {
      res.status(206).send("<h1>phone is empty");
    } else {
      res.status(206).send("<h1>name is empty");
    }
  } else {
    const checkNameMatch = data.find((d) => d.name === newPhonebook.name);
    const checkPhoneMatch = data.find((d) => d.phone === newPhonebook.phone);
    if (!checkNameMatch && !checkPhoneMatch) {
      const newData = {
        id: generateId(),
        name: newPhonebook.name,
        phone: newPhonebook.phone,
      };
      data.push(newData);
      res.status(201).send("<h1>data successfully saved</h1>");
    } else if (checkNameMatch && checkPhoneMatch) {
      res.send("<h1>the given name and phone already exist</h1>");
      res.status(404).end();
    } else {
      if (checkNameMatch) {
        res.send("<h1>the given name already exist</h1>");
        res.status(404).end();
      } else if (checkPhoneMatch) {
        res.send("<h1>the given phone already exist</h1>");
        res.status(404).end();
      }
    }
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(3001, () => {
  console.log("server id runnning");
});