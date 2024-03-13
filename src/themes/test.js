const users = [
  { firstName: "John", lastName: "Doe", age: 26 },
  { firstName: "Jane", lastName: "Doe", age: 75 },
  { firstName: "Jack", lastName: "Doe", age: 50 },
  { firstName: "Jill", lastName: "Doe", age: 26 },
];

const usersByAge = users.reduce((acc, user) => {
  if (acc[user.age]) {
    acc[user.age]++;
  } else {
    acc[user.age] = 1;
  }

  return acc;
}, {});

const namesOfAgeLessThan30 = users.filter(user => user.age < 30).map(userName => userName.firstName);

const namesOfAgeLessThan30_2 = users.reduce((acc, curr) => {
  if (curr.age < 30) {
    acc.push(curr.firstName);
  }

  return acc;
}, []);
