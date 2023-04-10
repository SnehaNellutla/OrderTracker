import React, { useEffect, useState } from 'react';
import { Button, Icon, IconButton, Modal, TextField } from '@mui/material';
import { Add, Delete, Search, Edit, SearchOutlined } from '@mui/icons-material';
import axios from 'axios';

import { Order } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';

export const OO: any = () => {

  const [isEdit, setIsEdit] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterorderType, setOrderType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    createdByUserName: '',
    orderType: '',
    customerName: ''
  });

  const fetchData = async () => {
    const response = await axios.get('https://red-candidate-web.azurewebsites.net/api/Orders', {
      headers: {
          'ApiKey': 'b7b77702-b4ec-4960-b3f7-7d40e44cf5f4',
          'Content-Type': 'application/json'
      }})
      setOrders(response.data);
    
  };
  
  useEffect(() => {
  
    fetchData();
  }, []);
  const handleSearchChange = () => {
    // setSearchText(event.target.value);
  };

  const handleOrderTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOrderType(event.target.value as string);
  };

  const handleCreateOrderClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  
  }
  const handleUpdateModalClose=()=>{
    setIsModalOpen(false);
    setSelectedOrder(null);
    setIsEdit(!isEdit);
  }

  const handleDeleteSelectedClick = async () => {
    const selectedIds = selectedOrders.map((orderId) => orderId);
  
    try {
      // Make API call to delete the selected items
      const response = await axios.post('https://red-candidate-web.azurewebsites.net/api/Orders/Delete', selectedIds, {
        headers: {
            'ApiKey': 'b7b77702-b4ec-4960-b3f7-7d40e44cf5f4',
            'Content-Type': 'application/json'
        }})
        fetchData();
      console.log(response);
  
      // Remove the deleted items from the data state
      setOrders(orders.filter((orderId) => !selectedIds.includes(orderId?.toString())));

      // Clear the selected state
      setSelectedOrders([]);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  const handleOrderSelect = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  const handleNewOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewOrder({ ...newOrder, [name]: value });
    
  };
  const handleUpdateOrderChnage=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = event.target;
   ;
    if (selectedOrder) {
        setSelectedOrder((prevOrder: any) => ({
          ...prevOrder,
          [name]: value,
        }));
      }

      console.log(selectedOrder);
  
  }

  const handleNewOrderSubmit = async () => {
    console.log(newOrder);
  debugger 
    try {
      let response: any;
      
        response = await axios.post('https://red-candidate-web.azurewebsites.net/api/Orders', JSON.stringify(newOrder), {
          headers: {
            'ApiKey': 'b7b77702-b4ec-4960-b3f7-7d40e44cf5f4',
            'Content-Type': 'application/json'
          }
        });
        setOrders(prevOrders => [...prevOrders, response.data]);
     
        setNewOrder({createdByUserName: '', orderType: '', customerName: '' });
        setIsModalOpen(false);
        console.log(response, newOrder);
     
      }
      
    catch (error) {
      console.log(error);
    }
  };
  
  const handleUpdateSubmit= async()=>{

    try {
        // Make API call to delete the selected items
        const response = await axios.put('https://red-candidate-web.azurewebsites.net/api/Orders', JSON.stringify(selectedOrder), {
          headers: {
              'ApiKey': 'b7b77702-b4ec-4960-b3f7-7d40e44cf5f4',
              'Content-Type': 'application/json'
          }})
          fetchData();
          setSelectedOrder({createdByUserName: '', orderType: '', customerName: '' });
          setIsModalOpen(false);
          setIsEdit(!isEdit)
        console.log(response);
    
        // Remove the deleted items from the data state

        // Clear the selected state
      } catch (error) {
        console.error(error);
        // Handle error here
      }
  }
  return (
    <div style={{padding: 16}}>
      <div style={{ display: 'flex', alignItems: 'center'}}> 
        
      <div className="search">
  {/* <input type="text" placeholder="Search" value=/>
  <Icon className="icon" >
    <Search />
  </Icon> */}
               <TextField
                fullWidth
                id="standard-bare"
                value={searchText}
                   
                InputProps={{
                  endAdornment: (
                    <IconButton  onClick={handleSearchChange}>
                      <SearchOutlined />
                    </IconButton>
                  ),
                }}
              />
</div>
        <button onClick={handleCreateOrderClick}>
          <Icon>
            <Add />
          </Icon>
          Create Order
        </button>
        <button onClick={handleDeleteSelectedClick}>
          <Icon>
            <Delete />
          </Icon>
          Delete Selected
        </button>
        <select value={filterorderType} onChange={handleOrderTypeChange}>
          <option value="">All Orders</option>
          <option value="Standard">Standard</option>
          <option value="SaleOrder">Sale Order</option>
          <option value="PurchaseOrder">Purchase Order</option>
          <option value="TransferOrder">Transfer Order</option>
          <option value="ReturnOrder">Return Order</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Order ID</th>
            <th>Creation Date</th>
            <th>Created By</th>
            <th>Order Type</th>
            <th>Customer</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders
            .filter(order => order.customerName.includes(searchText) && (!filterorderType || order.orderType === filterorderType    ))
            .map(order => (
              <tr key={order.orderId}>
                <td>
                  <input type="checkbox" checked={order.orderId ? selectedOrders.includes(order.orderId) : false} onChange={() => handleOrderSelect(order.orderId ? order.orderId : '')} />
                </td>
                <td>{order.orderId}</td>
                <td>{order.createdDate?.toLocaleString()}</td>
                <td>{order.createdByUserName}</td>
                <td>{order.orderType}</td>
                <td>{order.customerName}</td>
                <td>
              
                <Icon onClick={() => {
  setSelectedOrder(order);
  setIsModalOpen(true);
  setIsEdit(!isEdit);
}}>
  <Edit />
</Icon>
    
                </td>
              
              </tr>
            ))}
        </tbody>
      </table>
      <Modal open={isModalOpen} onClose={handleModalClose}>
  <div style={{ backgroundColor: 'white', padding: 16 }}>
    
        {isEdit ? (
    <h2>Update Data Page</h2>) : <h1>Create New Order</h1>}
   
    <TextField
      label="Created By"
      value={selectedOrder?.createdByUserName || newOrder.createdByUserName}
      name="createdByUserName"
      onChange={isEdit?handleUpdateOrderChnage:handleNewOrderChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Type"
      value={selectedOrder?.orderType || newOrder.orderType}
      name="orderType"
      onChange={isEdit?handleUpdateOrderChnage:handleNewOrderChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="Customer"
      value={selectedOrder?.customerName || newOrder.customerName}
      name="customerName"
      onChange={isEdit?handleUpdateOrderChnage:handleNewOrderChange}
      fullWidth
      margin="normal"
    />
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    {isEdit ? (
      <><Button variant="contained" color="primary" onClick={handleUpdateSubmit}> Update
                          </Button><Button variant="contained" onClick={handleUpdateModalClose} style={{ marginLeft: 8 }}>
                                  Cancel
                              </Button></>
      
      ):  
      <><Button variant="contained" color="primary" onClick={handleNewOrderSubmit}>Create Order</Button><Button variant="contained" onClick={handleModalClose} style={{ marginLeft: 8 }}>
                              Cancel
                          </Button></>
      }
    </div>
  </div>
</Modal>

    </div>
  );
};