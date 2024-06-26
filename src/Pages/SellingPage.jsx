import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../Components/SearchBar';


const SellingPage = () => {
  const [formData, setFormData] = useState({
    item: '',
    description: '',
    quantity: '',
    price: '',
    centre: 'efb7698e-f1fd-4ca8-8988-e5eab4f2fe9c',
    order_type: 'SELL',
  });

  const [items, setItems] = useState([]); //for storing the list of items // Add this line
  const [selectedItem, setSelectedItem] = useState(null); // Add this line

  const fetchItems = () => {
    axios.get('https://lordgrim.pythonanywhere.com/api/v1/shop_items/all/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setItems(response.data.data);
        console.log(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

    if (event.target.name === 'item') {
      fetchItems(); // Call the fetchItems function here
    }

    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

    if (event.target.name === 'item') {
      const item = items.find(item => item.id === event.target.value);
      setSelectedItem(item); // Update the selected item
    }
  };

  //for getting the list of items from the API
  useEffect(() => {
    fetchItems();
  }, []);


  // to post the data to the API
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedItem && formData.quantity) {
      const total_price = selectedItem.unit_price * formData.quantity;

      try {
        const response = await axios.post('https://lordgrim.pythonanywhere.com/api/v1/order/create/', {
          item: selectedItem.id,
          quantity: formData.quantity,
          total_price: total_price,
          order_type: formData.order_type,
          centre: formData.centre
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log(response.data);
        alert('Order placed successfully!');
      } catch (error) {
        console.error('Error creating order:', error);
        alert('Error creating order. Please try again.');
      }
    }
  };
  return (
    <>
      <SearchBar/>
      <div className='flex flex-col p-10'>
        <div className='listcr underline text-4xl p-1 h-12 overflow-hidden'><p><center>Create a Listing</center></p></div>
        <form className='flex flex-col items-center justify-center gap-10 mt-10' onSubmit={handleSubmit}>
          <div className='fieldtitle'>
            <label>
              <div className='titlename text-sm'>Item</div>
              <div className='titlesub'>
              <select name="item" className='field text-sm p-3 bg-green-50' onChange={handleChange}>
                {items.map(item => (
                  <>
                    <option key={item.id} value={item.id}>{item.name}</option>
                  </>
                ))}
              </select>
              {selectedItem && ( // Display the unit price of the selected item
                  <div className='mt-7'>
                    <p className='text-sm'>Unit price: {selectedItem.unit_price}</p>
                  </div>
                )}
              </div>
            </label>  
          </div>
          <div className='flex gap-4'>
            <div className='fieldtitle'>
              <label><div className='titlename'>Quantity</div>
                <div className='titlesub'>
                  <input type="number" name="quantity" placeholder="Enter quantity" className='bg-green-50 p-2 text-sm rounded-md' onChange={handleChange} />
                </div>
              </label>
            </div>
            <div className='fieldtitle'>
          <label>
          <div className='titlename'>Total Price</div>
            <div className='titlesub'>
              {selectedItem && formData.quantity ? 
              <p className='bg-green-50 p-2 text-sm rounded-md'>{selectedItem.unit_price * formData.quantity}</p> 
              : 'nil'
            }
            </div>
            </label>
          </div>
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Sell Item</button>
        </form>
      </div>
    </>
  );
};


export default SellingPage;