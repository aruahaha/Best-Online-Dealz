import React, { Suspense, useEffect, useState } from "react";
import { getOtherOffers, addOtherRow, delOtherRow } from "../Server/api";
import { defer, useLoaderData, Await } from "react-router";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    Checkbox, // Import Checkbox
    styled,
    Alert,
    LinearProgress
} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Link } from "react-router-dom";
import { auth } from "../firebase.js";
import Login from "./Login.jsx"

export async function loader() {
    return defer({ rows: getOtherOffers() });
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export default function OtherManagement() {
    const rows = useLoaderData();
    const [user, setUser] = useState(null)

    const [open, setOpen] = React.useState(false);
    const [row, setRow] = React.useState({
        title: "",
        description: "",
        price: "",
        additionainfo: "",
        affiliatelink: ""
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
    };

    const handleClose = () => {
        setOpen(false);
        setDeleteDialogOpen(false);
        setSelectedRowIds([]);
    }

    const handleAdd = () => {
        setOpen(false);
        if (row.title === "" || row.description === "" || row.price === 0 || row.imageurl === "" || row.affiliatelink === "") {
            alert("All fields should be filled.")
        } else {
            // shortUrl(row.name, row.asin, row.additional)
            addOtherRow(row.title, row.description, row.price, row.imageurl, row.affiliatelink);
        }
    }

    const handleTitleChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            title: event.target.value
        }))
    }
    
    const handleDescriptionChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            description: event.target.value
        }))
    }

    const handlePriceChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            price: event.target.value
        }))
    }
    
    const handleAdditionalInfoChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            additionainfo: event.target.value
        }))
    }
    
    const handleAffiliateLinkChange = (event) => {
        setRow(prevRow => ({
            ...prevRow,
            affiliatelink: event.target.value
        }))
    }

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

    const handleDeleteSelected = () => {
        selectedRowIds.forEach((id) => {
            delOtherRow(id);
        });
        setDeleteDialogOpen(false);
        setSelectedRowIds([]);
    };

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
                >
                    <span>Delete Selected</span>
                </Button>
                <Link to="/management">
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
                    <DialogContent>
                        <h1>Title</h1>
                        <TextField id="outlined-title" label="Title" variant="outlined" onChange={handleTitleChange} />
                        <h1>Description</h1>
                        <TextField id="outlined-decription" label="Description" variant="outlined" onChange={handleDescriptionChange} />
                        <h1>Price</h1>
                        <TextField id="outlined-price" label="Price" variant="outlined" onChange={handlePriceChange} />
                        <h1>Additional Info</h1>
                        <TextField id="outlined-imageurl" label="ImageUrl" variant="outlined" onChange={handleAdditionalInfoChange} />
                        <h1>Affiliate Link</h1>
                        <TextField id="outlined-affiliatelink" label="AffiliateLink" variant="outlined" onChange={handleAffiliateLinkChange} />
                    </DialogContent>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleAdd}>
                        ADD
                    </Button>
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
                            <TableCell>Title</TableCell>
                            <TableCell>Price</TableCell>
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
                                            <TableCell>{row.title}</TableCell> 
                                            <TableCell>{row.price}</TableCell>
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
