import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField, // Import Checkbox
    styled
} from "@mui/material";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { Await, defer, redirect, useLoaderData } from "react-router";
import { Link } from "react-router-dom";
import { addRow, delRow, getRowById, getTable, updateData } from "../Server/api";
import { shortUrl } from "../utils";
import { auth } from "../firebase.js";
import Login from "./Login.jsx"


export async function loader({ request }) {
    return defer({ rows: getTable() });
}

const catagories = [
    "Smartphones",
    "Laptops",
    "In-Ear Headphones",
    "Ceiling Fans",
    "Smart Watches",
    "Perfume",
    "Kitchen appliances",
    "Mixer Grinders",
    "Smart TVs",
    "Speakers",
    "Power Banks",
    "Trimmers & Shavers",
    "Backpacks"
]

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function Management() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const rows = useLoaderData();
    const [editTableData, setEditTableData] = useState()
    const [editDialogOpen, setEditDialogOpen] = useState(false)

    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState({
        name: "",
        asin: "",
        additional: ""
    });
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [selectedRowIds, setSelectedRowIds] = React.useState([]);
    const [selectAll, setSelectAll] = React.useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };



    const handleClickOpen = () => {
        setOpen(true);
        setRow({
            name: "",
            asin: "",
            additional: ""
        })
    };



    const handleClose = () => {
        setOpen(false);
        setEditTableData([])
        setDeleteDialogOpen(false);
        setSelectedRowIds([]);
        setEditDialogOpen(false)
    }

    const handleAdd = async () => {
        setOpen(false);

        if (row.name === "" || row.asin === "") {
            alert("Name and AsinCode should be filled.");
            return;
        }

        try {
            const browseNodesResponse = await axios.get(`https://bodz-server.vercel.app/api/getItem/${row.asin}`);

            const browseNodes = browseNodesResponse?.data?.item?.ItemsResult?.Items[0]?.BrowseNodeInfo?.BrowseNodes.map(nodes => nodes?.ContextFreeName) || [];

            const matchedCategories = catagories.filter(category =>
                browseNodes.some(node => node.trim().toLowerCase() === category.trim().toLowerCase())
            );
            const matchedCategoriesString = matchedCategories.join(', ');
            const addedProduct = await addRow(row.name, row.asin, matchedCategoriesString);

            shortUrl(row.name, row.asin, row.additional)
            setRow(prevRow => ({
                ...prevRow,
                additional: ""
            }));
        } catch (error) {
            console.error("Error fetching browse nodes:", error);

        }
    };


    const handleFieldChange = (fieldName, value) => {
        if (fieldName === "asin") {
            const regex = /\b([A-Z0-9]+)\b/;
            const matchResult = value.match(regex);

            if (matchResult) {

                setRow(prevRow => ({
                    ...prevRow,
                    [fieldName]: matchResult[0]
                }));

            } else {

                setRow(prevRow => ({
                    ...prevRow,
                    [fieldName]: ''
                }));

            }
        } else {
            setRow(prevRow => ({
                ...prevRow,
                [fieldName]: value
            }));
        }
    }



    // const handleNameChange = (event) => {
    //     setRow(prevRow => ({
    //         ...prevRow,
    //         name: event.target.value
    //     }))
    // }

    // const handleAsinChange = (event) => {
    //     const regex = /\b([A-Z0-9]+)\b/;
    //     const matchResult = event.target.value.match(regex);

    //     if (matchResult) {

    //         setRow(prevRow => ({
    //             ...prevRow,
    //             asin: matchResult[0]
    //         }));
    //     } else {


    //         setRow(prevRow => ({
    //             ...prevRow,
    //             asin: ''
    //         }));
    //     }
    // }

    // const handleAdditionalChange = (event) => {
    //     setRow(prevRow => ({
    //         ...prevRow,
    //         additional: event.target.value
    //     }))
    // }

    const handleCheckboxChange = (id) => {
        const selectedIndex = selectedRowIds.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedRowIds, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedRowIds.slice(1));
        } else if (selectedIndex === selectedRowIds.length - 1) {
            newSelected = newSelected.concat(selectedRowIds.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedRowIds.slice(0, selectedIndex),
                selectedRowIds.slice(selectedIndex + 1)
            );
        }

        setSelectedRowIds(newSelected);
    };

    // const handleSelectAll = () => {
    //     if (selectAll) {
    //         setSelectedRowIds([]);
    //     } else {
    //         const newSelected = rows.rows.map((row) => row.id);
    //         setSelectedRowIds(newSelected);
    //     }

    //     setSelectAll(!selectAll);
    // };

    const handleDeleteSelected = () => {
        const reversedSelectedRowIds = [...selectedRowIds].reverse();
        reversedSelectedRowIds.forEach((id) => {
            delRow(id);
        });
        setDeleteDialogOpen(false);
        setSelectedRowIds([]);
    };

    const handleEditClick = async (id) => {
        try {
            const tableData = await getRowById(id);
            setEditTableData(tableData[0])
            setOpen(true);
            setEditDialogOpen(true);
            setRow({
                name: tableData[0].name,
                asin: tableData[0].asin,
                additional: tableData[0].additional
            });
        } catch (error) {
            console.error("Error editing table data:", error);
        }
    };

    const handleUpdate = () => {
        updateData(editTableData.id, row.name, row.asin)
        setOpen(false)
        shortUrl(row.name, row.asin, row.additional)
        setRow(prevRow => ({
            ...prevRow,
            additional: ""
        }));
    }
    

    console.log(user)

    if (user && user.providerData[0].providerId == "google.com") {
        if (!user || user.email && user.email !== import.meta.env.VITE_ADMIN_USER_MAIL) {
            return <Login />;
        }
    } else if (!user) {
        return <Login />
    }



    return (
        <>

            <div className="add-product-btn">
                <Button variant="contained" onClick={handleClickOpen} >
                    <span>Add</span><AddCircleIcon />
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        setDeleteDialogOpen(true);
                    }}
                    className="delete-row-btn"
                >
                    <span>Delete</span>
                </Button>
                <Link to="/other-management">
                    <Button variant="contained" color="success">
                        Switch
                    </Button>
                </Link>
                {user && (
                    <Button variant="contained" color="error" onClick={handleSignOut}>
                        <span>Log Out</span>
                    </Button>
                )}
            </div>

            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    ADD PRODUCT
                </DialogTitle>
                <DialogContent dividers>
                    <h3>Name</h3>
                    <TextField
                        id="outlined-name"
                        label="Name"
                        variant="outlined"
                        onChange={(event) => handleFieldChange('name', event.target.value)}
                        sx={{
                            "& .MuiInputBase-input": {
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }
                        }}
                        value={editTableData && editTableData.length > 0 ? editTableData[0].name : row.name}
                    />
                    <h3>ASIN</h3>
                    <TextField
                        id="outlined-asin"
                        label="Asin"
                        variant="outlined"
                        onChange={(event) => handleFieldChange('asin', event.target.value)}
                        value={editTableData && editTableData.length > 0 ? editTableData[0].asin : row.asin}
                    />
                    <h3>Additonal</h3>
                    <TextField
                        id="outlined-additional"
                        label="Coupon"
                        variant="outlined"
                        onChange={(event) => handleFieldChange('additional', event.target.value)}
                        value={editTableData && editTableData.length > 0 ? editTableData[0].additional : row.additional}
                    />
                </DialogContent>
                <DialogActions>
                    {editDialogOpen ?
                        <Button variant="contained" onClick={handleUpdate}>
                            UPDATE
                        </Button>
                        :
                        <Button variant="contained" onClick={handleAdd}>
                            ADD
                        </Button>
                    }
                </DialogActions>
            </BootstrapDialog>

            <TableContainer component={Paper} >
                <Table sx={{ minWidth: 250 }} aria-label="simple table">

                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Checkbox
                                    indeterminate={selectedRowIds.length > 0 && selectedRowIds.length < rows.rows.length}
                                    checked={selectAll}
                                // onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>ASIN</TableCell>
                            <TableCell>Edit</TableCell>
                            {/* <TableCell>Action</TableCell> */}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        <Suspense fallback={<TableRow><TableCell colSpan={5}><LinearProgress variant="indeterminate" /></TableCell></TableRow>}>
                            <Await resolve={rows.rows}>
                                {(rows) => (
                                    rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRowIds.indexOf(row.id) !== -1}
                                                    onChange={() => handleCheckboxChange(row.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.asin}</TableCell>
                                            <TableCell>
                                                <Button onClick={() => handleEditClick(row.id)}>
                                                    <EditIcon sx={{ color: "black" }} />
                                                </Button>
                                            </TableCell>
                                            {/* <TableCell>
                                                <Button onClick={() => handleDeleteClick(row.id)}>
                                                    <DeleteIcon className="table-delete-btn" />
                                                </Button>
                                            </TableCell> */}
                                        </TableRow>
                                    ))
                                )}
                            </Await>
                        </Suspense>
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="delete-row-btn-2">
                <Button
                    variant="contained"
                    color="secondary"

                    className="delete-row-btn-2"
                    onClick={() => {
                        setDeleteDialogOpen(true);
                    }}
                >
                    <span>Delete</span>

                </Button>
            </div>
            <Dialog
                open={deleteDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteSelected} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
