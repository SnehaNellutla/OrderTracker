import React, { useEffect, useState } from 'react';
import { Button, FormControl, Icon, IconButton, InputLabel, MenuItem, Modal, Select, SelectChangeEvent, TextField } from '@mui/material';
import { Add, Delete, Search, Edit, } from '@mui/icons-material';
import axios from 'axios';

import { Order } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import './App.css';
import { setContent, setIsCreating } from './draftSlice';
export const OO: any = () => {

  const dispatch= useDispatch();
  const {isCreating, content}=useSelector((state:any)=>state.draft);
  const [isEdit, setIsEdit] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterorderType, setOrderType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchClick, setSearchClick]=useState(false);
  const [newOrder, setNewOrder] = useState({
    createdByUserName: "",
    orderType: "",
    customerName: "",
  });

  const fetchData = async () => {
    const response = await axios.get(
      "https://red-candidate-web.azurewebsites.net/api/Orders",
      {
        headers: {
          ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
          "Content-Type": "application/json",
        },
      }
    );
    setOrders(response.data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchText(event.target.value);
  };

  useEffect(()=>{

    if(isCreating){
     
      dispatch(setContent(newOrder));
    }
          
  }, [isCreating])

  useEffect(()=>{
        if(content!=null){
          
          handleNewOrderSubmit();

        }

  },[content])

  console.log("Content", content);

  const handleSearchClick=()=>{
    setSearchClick(!searchClick)
  }

  const handleOrderTypeChange = (event: SelectChangeEvent<string>) => {
    setOrderType(event.target.value as string);
  };

  const handleCreateOrderClick = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };
  const handleUpdateModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setIsEdit(!isEdit);
  };

  const handleDeleteSelectedClick = async () => {
    const selectedIds = selectedOrders.map((orderId) => orderId);

    try {
      // Make API call to delete the selected items
      const response = await axios.post(
        "https://red-candidate-web.azurewebsites.net/api/Orders/Delete",
        selectedIds,
        {
          headers: {
            ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
            "Content-Type": "application/json",
          },
        }
      );
      fetchData();
      console.log(response);

      // Remove the deleted items from the data state
      setOrders(
        orders.filter((orderId) => !selectedIds.includes(orderId?.toString()))
      );

      // Clear the selected state
      setSelectedOrders([]);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };

  const handleOrderSelect = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };
  const handleNewOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setNewOrder({ ...newOrder, [name]: value });
  };
  const handleUpdateOrderChnage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    if (selectedOrder) {
      setSelectedOrder((prevOrder: any) => ({
        ...prevOrder,
        [name]: value,
      }));
    }

    console.log(selectedOrder);
  };

  const handleNewOrderSubmit = async () => {
    console.log(newOrder);
  debugger 
  
    try {
      let response: any;

      response = await axios.post(
        "https://red-candidate-web.azurewebsites.net/api/Orders",
        JSON.stringify(newOrder),
        {
          headers: {
            'ApiKey': 'b7b77702-b4ec-4960-b3f7-7d40e44cf5f4',
            'Content-Type': 'application/json'
          }
        });
        setOrders(prevOrders => [...prevOrders, response.data]);
     
        setNewOrder({createdByUserName: '', orderType: '', customerName: '' });
        setIsModalOpen(false);
        console.log(response, newOrder);
        dispatch(setIsCreating(false));
     
      }
      
    catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      // Make API call to delete the selected items
      const response = await axios.put(
        "https://red-candidate-web.azurewebsites.net/api/Orders",
        JSON.stringify(selectedOrder),
        {
          headers: {
            ApiKey: "b7b77702-b4ec-4960-b3f7-7d40e44cf5f4",
            "Content-Type": "application/json",
          },
        }
      );
      fetchData();
      setSelectedOrder({
        createdByUserName: "",
        orderType: "",
        customerName: "",
      });
      setIsModalOpen(false);
      setIsEdit(!isEdit);
      console.log(response);

      // Remove the deleted items from the data state

      // Clear the selected state
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  };
  return (
    <div style={{padding: 16}}>
      <div style={{ display: 'flex', alignItems: 'center'}}> 
        
      {/* <div className="search"> */}
  {/* <input type="text" placeholder="Search" value={searchText} onChange={handleSearchChange}/>
  <Icon className="icon" >
    <Search />
  </Icon> */}
  <TextField
        label="Search"
        variant="outlined"
        value={searchText}
        onChange={handleSearchChange}
      />
      <Button variant="contained" color="primary" onClick={handleSearchClick}>
        <Search />
      </Button>
               {/* <TextField
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
              /> */}
{/* </div> */}
       
        <Button className="button" variant="contained" endIcon={ <Add />} onClick={handleCreateOrderClick}>
        Create Order
</Button>
        <Button className="button" variant="contained" endIcon={ <Delete />} onClick={handleDeleteSelectedClick}>
        Delete Selected
</Button>
<FormControl sx={{ m: 1, minWidth: 160}}>
<InputLabel id="demo-simple-select-helper-label">Order Type</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={filterorderType}
          label="Order Type"
          onChange={handleOrderTypeChange}
        >
           <MenuItem value="">All Orders</MenuItem>
          <MenuItem value="Standard">Standard</MenuItem>
          <MenuItem value="SaleOrder">Sale Order</MenuItem>
          <MenuItem value="PurchaseOrder">Purchase Order</MenuItem>
          <MenuItem value="TransferOrder">Transfer Order</MenuItem>
          <MenuItem value="ReturnOrder">Return Order</MenuItem>
        </Select>
        </FormControl>
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
            .filter(
              (order) =>
                order.customerName.includes(searchText) &&
                (!filterorderType || order.orderType === filterorderType)
            )
            .map((order) => (
              <tr key={order.orderId}>
                <td>
                  <input
                    type="checkbox"
                    checked={
                      order.orderId
                        ? selectedOrders.includes(order.orderId)
                        : false
                    }
                    onChange={() =>
                      handleOrderSelect(order.orderId ? order.orderId : "")
                    }
                  />
                </td>
                <td>{order.orderId}</td>
                <td>{order.createdDate?.toLocaleString()}</td>
                <td>{order.createdByUserName}</td>
                <td>{order.orderType}</td>
                <td>{order.customerName}</td>
                <td>
              
                {/* <Icon onClick={() => {
  setSelectedOrder(order);
  setIsModalOpen(true);
  setIsEdit(!isEdit);
}}>
   <Edit />
</Icon> */}
  <IconButton aria-label="delete" onClick={() => {
  setSelectedOrder(order);
  setIsModalOpen(true);
  setIsEdit(!isEdit);
}} >
  <Edit />
</IconButton>
 
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
      <><Button variant="contained" color="primary" onClick={()=>{dispatch(setIsCreating(true))}}>Create Order</Button><Button variant="contained" onClick={handleModalClose} style={{ marginLeft: 8 }}>
                              Cancel
                          </Button></>
      }
    </div>
  </div>
</Modal>

          <TextField
            label="Created By"
            value={
              selectedOrder?.createdByUserName || newOrder.createdByUserName
            }
            name="createdByUserName"
            onChange={isEdit ? handleUpdateOrderChnage : handleNewOrderChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Type"
            value={selectedOrder?.orderType || newOrder.orderType}
            name="orderType"
            onChange={isEdit ? handleUpdateOrderChnage : handleNewOrderChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Customer"
            value={selectedOrder?.customerName || newOrder.customerName}
            name="customerName"
            onChange={isEdit ? handleUpdateOrderChnage : handleNewOrderChange}
            fullWidth
            margin="normal"
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {isEdit ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateSubmit}
                >
                  {" "}
                  Update
                </Button>
                <Button
                  variant="contained"
                  onClick={handleUpdateModalClose}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNewOrderSubmit}
                >
                  Create Order
                </Button>
                <Button
                  variant="contained"
                  onClick={handleModalClose}
                  style={{ marginLeft: 8 }}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
       </div>
       
      </Modal>
    </div>
  );
};
