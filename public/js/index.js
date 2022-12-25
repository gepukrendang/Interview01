import salaryJson from "/data/salary_data.json" assert { type: "json" };

let userList;
const url = "http://jsonplaceholder.typicode.com/users";
const rateIDRtoUSD = 0;

function urlCurrency(base, to) {
  return `https://api.apilayer.com/fixer/latest?base=${base}&symbols=${to}`;
}

const myHeaders = new Headers();
myHeaders.append("apikey", "y09gW3Lwx6pqVn1uwqRdijwkO9PZpekU");

let requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: myHeaders,
};

function combineSalary(array1, array2, rate) {
  for (let i in array1) {
    if (array1[i].id === array2[i].id) {
      array1[i]["salaryIDR"] = array2[i].salaryInIDR.toLocaleString();
      array1[i]["salaryUSD"] = (array2[i].salaryInIDR * rate).toLocaleString();
    }
  }
}

async function getCurrency(urlCurrency) {
  const response = await fetch(urlCurrency, requestOptions);
  let dataCurr = await response.json();
  return dataCurr.rates.USD;
}

async function getData(url) {
  const response = await fetch(url);
  let data = await response.json();

  const urlIDRtoUSD = urlCurrency("IDR", "USD");
  const rateUSD = await getCurrency(urlIDRtoUSD);

  combineSalary(data, salaryJson.array, rateUSD);
  renderUser(data);
}

function renderUser(users) {
  let row = "";

  for (let i in users) {
    row += `<tr>  
    <td>${users[i].id} </td> 
    <td>${users[i].name}</td> 
    <td>${users[i].username}</td>      
    <td>${users[i].email}</td>
    <td>${users[i].address.street}, ${users[i].address.suite}, ${users[i].address.city},  ${users[i].address.zipcode}</td>
    <td>${users[i].phone}</td>
    <td>Rp. ${users[i].salaryIDR}</td>
    <td> $ ${users[i].salaryUSD}</td>
    </tr>
    `;
  }

  console.log(row);

  document.getElementById("users-list").innerHTML = row;
}

getData(url);
