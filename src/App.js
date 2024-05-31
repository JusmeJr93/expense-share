import { useState } from "react";

export default function App() {
  return (
    <>
      <Banner
        appName="Expense Share App"
        logoUrl="expense.png" />
      <ExpenseShare />
      <Footer />
    </>
  );
}


//navbar
function Banner({ appName, logoUrl }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand" title="ExpenseShare by Junior Jusmé" onClick={() => window.location.reload()}>
        <img src={logoUrl} alt={`${appName} logo`} className="navbar-logo" />
        <span className="navbar-name">{appName}</span>
      </div>
    </nav>
  );
}


// Initial friends data with unique ids, names, images, and balances
const initialFriends = [
  {
    id: 96574,
    name: "Caitlin",
    image: "https://i.pravatar.cc/48?u=96574",
    balance: 1, // Positive balance indicates the friend owes the user
  },
  {
    id: 65874631,
    name: "Edwards",
    image: "https://i.pravatar.cc/48?u=65874631",
    balance: -1, // Negative balance indicates the user owes the friend
  },
  {
    id: 168425,
    name: "Thomas",
    image: "https://i.pravatar.cc/48?u=168425",
    balance: 0, // Zero balance indicates even status
  },
];


function ExpenseShare() {
  const [toggleAddFriend, setToggleAdd] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [searchName, setSearchName] = useState('');

  // Function to toggle the Add Friend form visibility
  function handleFormtoggle() {
    setToggleAdd(prevState => !prevState);
    setSelectedFriend(null); // Close Split Bill form if Add Friend form is toggled
  }

  // Function to add a new friend to the list
  function handleAddFriend(friend) {
    setFriends(prevFriends => [...prevFriends, friend]);
    setToggleAdd(false); // Close the Add Friend form after adding a friend
  }

  // Function to handle friend selection and deselection
  function handleSelection(friend) {
    setSelectedFriend((currentSelected) => currentSelected?.id === friend.id ? null : friend
    ); // Toggle selection or deselection with an optional chaining
    setToggleAdd(false); // Close the Add Friend form if it's open
  }

  // Function to handle splitting the bill
  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend
    )
    );
    setSelectedFriend(null); // Close the split form after splitting the bill
  }

  // Function to handle searching 
  function handleSearchName(nameToSearch) {
    setSearchName(nameToSearch);
  }

  // Filter friends based on the search input
  const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="main">
      <div className="sidebar">
        <Search
          searchName={searchName}
          setSearchName={setSearchName}
          onSearchName={handleSearchName} />

        <FriendsList
          friends={filteredFriends} //to render filtered name
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
          searchName={searchName} />

        {toggleAddFriend && <FormAddFriend onAddfriend={handleAddFriend} />}

        <Button listenClick={handleFormtoggle}>
          {toggleAddFriend ? 'Close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend &&
        <FormSplitBill
          selectedFriend={selectedFriend}
          friends={friends}
          handleSplitBill={handleSplitBill} />}
    </div>
  );
}


// Button component with a click listener
function Button({ children, listenClick }) {
  return <button className="button" onClick={listenClick}>{children}</button>;
}


// Search function to search by name
function Search({ searchName, setSearchName, onSearchName }) {
  return <div className="search">
    <input
      type="search"
      placeholder="Enter name 🔎"
      value={searchName}
      onChange={e => setSearchName(e.target.value)} />

    <Button listenClick={() => onSearchName(searchName)}>Search</Button>
  </div>;
}

// FriendsList component to display the list of friends
function FriendsList({ friends, onSelection, selectedFriend, searchName }) {
  return (
    <>
      {friends.length > 0 ? (
        <ul>
          {friends.map(friendObj => (
            <Friend
              friend={friendObj}
              key={friendObj.id}
              onSelection={onSelection}
              selectedFriend={selectedFriend} />
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: '2rem', marginBottom: '3rem' }}>"{searchName}" was not found. You can add it below.</p>
      )}
    </>
  );
}


// Friend component to display individual friend details
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id; // Check if the friend is selected

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && (
        <p>
          You and {friend.name} are even.
        </p>
      )}
      <Button listenClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}



// FormAddFriend component to add a new friend
function FormAddFriend({ onAddfriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  // Handle form submission to add a friend
  function handleSubmit(e) {
    e.preventDefault();

    let id = crypto.randomUUID(); // Create a unique id in the browser

    if (!name) return; // Do nothing if the name is not provided

    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`, // Generate a static photo with a unique URL
      balance: 0
    };

    onAddfriend(newFriend); // Call the callback to add the friend

    setName(''); // Reset the name field
    setImage('https://i.pravatar.cc/48'); // Reset the image field
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <div>
        <span className="label">👩🏻‍🤝‍👨Friend Name</span>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={e => setName(e.target.value)} />
      </div>

      <div>
        <span className="label">🙍🏻‍♂Random Image</span>
        <input
          type="text"
          placeholder="https://image.url"
          disabled
          value={image}
          onChange={e => setImage(e.target.value)} />
      </div>

      <Button>Add</Button>
    </form>

  );
}


// FormSplitBill component to split the bill with the selected friend
function FormSplitBill({ selectedFriend, handleSplitBill }) {
  const [bill, setBill] = useState('');
  const [userExpense, setUserExpense] = useState('');
  const friendExpense = (bill - userExpense);
  const [whoPayed, setWhoPayed] = useState('');

  // Handle form submission to split the bill
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return; // Do nothing if the bill or user expense is not provided

    let billBalance;

    if (whoPayed === 'user') billBalance = friendExpense;
    if (whoPayed === selectedFriend.name) billBalance = -userExpense;

    handleSplitBill(billBalance); // Call the callback to split the bill
  }

  return (
    <div className="form-split-bill">
      <h2>Split the bill with "{selectedFriend.name}"</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>💰 Bill value</label>
          <input
            type="text"
            placeholder="Enter bill"
            value={bill}
            onChange={e => setBill(Number(e.target.value))} />
        </div>

        <div>
          <label>💸 Your expense</label>
          <input
            type="text"
            value={userExpense}
            onChange={e => setUserExpense(Number(e.target.value) > bill ? userExpense : Number(e.target.value))} /> {/* Prevent entering a value higher than the bill */}
        </div>

        <div>
          <label>👩🏻‍🤝‍👨 {selectedFriend.name}'s expense</label>
          <input type="text" disabled value={userExpense == 0 ? '' : friendExpense} />
        </div>

        <div>
          <label>🤑 Who's paying the bill?</label>
          <select value={whoPayed} onChange={e => setWhoPayed(e.target.value)}>
            <option defaultValue="" hidden disabled></option>
            <option value="user">You</option>
            <option value={selectedFriend.name}>{selectedFriend.name}</option>
          </select>
        </div>
        <div className="button-split">
          <Button>Split bill</Button>
        </div>
      </form>
    </div>
  );
}


//footer
function Footer() {
  return (
    <footer className="footer">
      <p>Check my Portfolio on <a href="https://github.com/JusmeJr93" rel="noreferrer" target="_blank">GitHub↗️</a> and
        connect with me on <a href="https://www.linkedin.com/in/junior-jusm%C3%A9-2b783012a/" rel="noreferrer" target="_blank">LinkedIn↗️</a></p>
      <p>&copy;2024. Todos los derechos reservados.</p>
    </footer>
  );
}

