// src/pages/Staff.jsx
import React, { useState, useEffect } from "react";
import {
  Typography, Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, CircularProgress, Alert
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";

import { db, auth } from "../modules/firebase/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../context/AuthContext";

export default function Staff() {
  const { role: currentUserRole, user: authUser, loading } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
    password: "",
    role: "staff",
  });
  const [editId, setEditId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [loadingAction, setLoadingAction] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        data = data.filter((u) => u.role !== "superadmin"); // exclude superadmins
        setUserList(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Filter users by search and role
  const filteredUsers = userList
    .filter((u) => roleFilter === "all" || u.role === roleFilter)
    .filter(
      (u) =>
        (u.firstName || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.lastName || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.role || "").toLowerCase().includes(search.toLowerCase())
    );

  const handleOpenDialog = (user = null) => {
    if (user) {
      setFormData({ ...user, password: "" });
      setEditId(user.id);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthdate: "",
        address: "",
        password: "",
        role: "staff",
      });
      setEditId(null);
    }
    setOpenDialog(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // Save (Create/Update) user
  const handleSave = async () => {
    if (loading) {
      alert("⏳ Still loading authentication. Please wait.");
      return;
    }

    if (!authUser || currentUserRole !== "superadmin") {
      alert("❌ Only Superadmin can create/update users.");
      return;
    }

    if (!formData.email || (!editId && !formData.password)) {
      alert("❌ Email and password are required for new users.");
      return;
    }

    setLoadingAction(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (editId) {
        // Update Firestore only
        const updateData = { ...formData };
        delete updateData.password; // don't store password
        await updateDoc(doc(db, "users", editId), updateData);
        setUserList(userList.map((u) => (u.id === editId ? { ...u, ...updateData } : u)));
        setSuccessMsg("User updated successfully!");
      } else {
        // Create user in Firebase Auth
        const newUser = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        // Save user in Firestore
        await setDoc(doc(db, "users", newUser.user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthdate: formData.birthdate,
          address: formData.address,
          role: formData.role,
          createdAt: new Date(),
          createdBy: authUser.email,
        });

        setUserList([...userList, { id: newUser.user.uid, ...formData }]);
        setSuccessMsg(`${formData.role} account created successfully!`);
      }

      handleCloseDialog();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        birthdate: "",
        address: "",
        password: "",
        role: "staff",
      });
      setEditId(null);
    } catch (err) {
      console.error("Error saving user:", err);
      setErrorMsg(err.message || "Failed to save user");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteDoc(doc(db, "users", id));
      setUserList(userList.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="User Management" open={sidebarOpen} setOpen={setSidebarOpen}>
        <Box p={3}><Typography>Loading authentication...</Typography></Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management" open={sidebarOpen} setOpen={setSidebarOpen}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Box
          p={3}
          sx={{
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">User Management</Typography>
            {currentUserRole === "superadmin" && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                  + Create User
                </Button>
              </motion.div>
            )}
          </Box>

          {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <Box display="flex" gap={2} mb={2}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
              select
              label="Filter by Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ width: 200 }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </TextField>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Birthdate</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.birthdate}</TableCell>
                    <TableCell>{user.address}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(user.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle>{editId ? "Edit User" : "Create User"}</DialogTitle>
            <DialogContent>
              <TextField
                label="First Name"
                fullWidth
                margin="dense"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="dense"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
              <TextField
                label="Email"
                fullWidth
                margin="dense"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                label="Phone"
                fullWidth
                margin="dense"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <TextField
                label="Birthdate"
                type="date"
                fullWidth
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={formData.birthdate}
                onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
              />
              <TextField
                label="Address"
                fullWidth
                margin="dense"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <TextField
                select
                label="Role"
                fullWidth
                margin="dense"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {currentUserRole === "superadmin" && <MenuItem value="admin">Admin</MenuItem>}
                <MenuItem value="staff">Staff</MenuItem>
              </TextField>

              {!editId && (
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="dense"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSave} variant="contained" disabled={loadingAction}>
                {loadingAction ? <CircularProgress size={20} /> : editId ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </motion.div>
    </DashboardLayout>
  );
}