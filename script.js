const name = document.getElementById("name");
const phoneNumber = document.getElementById("number");
const addbtn = document.getElementById("add-btn");
const contactsList = document.getElementById("contacts");
const editbtn = document.getElementById("edit-btn");
const deletebtn = document.getElementById("delete-btn");
const SaveOk = document.getElementById("Ok");
let users;

async function getUsers() {
    const javob = await fetch("https://676a7d85863eaa5ac0de8e06.mockapi.io/api/v1/users");
    users = await javob.json();
    usersView(users);
}
getUsers()

function usersView(data) {
    contactsList.innerHTML = "";
    data.forEach(user => {
        const li = document.createElement("li");
        li.setAttribute("data-id", user.id);
        li.innerHTML = `
          <i class="fa-regular fa-user"></i>
                <div class="list">
                    <div>
                        <h2>Name:${user.Name}</h2>
                        <p>${user.PhoneNumber}/${user.Name}</p>
                    </div>
                    <div class="btn-box">
                        <button id="edit-btn" onClick="editUser(this)"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button id="delete-btn" onClick="deleteUser(${user.id})"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </div>
         `;
        contactsList.appendChild(li);
    });
}

addbtn.addEventListener("click", () => {
    if (name.value.trim().length < 1 || phoneNumber.value.trim().length < 1) {
        alert("Please write something!!!")
    } else {
        AddContact(name.value, phoneNumber.value);
    }
})

async function AddContact(ism, tell) {
    try {
        const response = await fetch("https://676a7d85863eaa5ac0de8e06.mockapi.io/api/v1/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name: ism,
                PhoneNumber: +tell
            })
        }
        );
        name.value = "";
        phoneNumber.value = "";
        getUsers()

    } catch (error) {
        console.log(error);
    }
}

async function deleteUser(id) {
    try {
        const response = await fetch(
            `https://676a7d85863eaa5ac0de8e06.mockapi.io/api/v1/users/${id}`,
            {
                method: "DELETE"
            }
        );
        getUsers();
    } catch (error) {
        console.log(error);
    }
}

async function editUser(e) {
    const id = e.parentNode.parentNode.parentNode.getAttribute("data-id");
    const ism = e.parentNode.parentNode.querySelector("h2").textContent.split(":")[1];
    const tel = e.parentNode.parentNode.querySelector("p").textContent.split("/")[0];

    name.value = ism;
    phoneNumber.value = tel;
    console.log(name.value,phoneNumber.value);
    

    addbtn.style.display = "none";
    SaveOk.style.display = "block";
    SaveOk.addEventListener("click", async () => {
        try {
            const response = await fetch(
                `https://676a7d85863eaa5ac0de8e06.mockapi.io/api/v1/users/${id}`,
                {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Name: name.value,
                        PhoneNumber: +phoneNumber.value
                    })
                }
            );
            name.value = "";
            phoneNumber.value = "";
            addbtn.style.display = "block";
            SaveOk.style.display = "none";
            getUsers();
        } catch (error) {
            console.log(error);
        }
    })
}