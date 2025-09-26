import React, { useState, useEffect } from "react";
import {
  Typography, Box, Button, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { motion } from "framer-motion";
import DashboardLayout from "../layouts/DashboardLayout";

// ✅ Always import shared instances
import { db, auth, functions } from "../modules/firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { httpsCallable } from "firebase/functions";

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

  // 🔹 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserList(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = userList
    .filter((u) => u.email !== "robert.llemit@gmail.com")
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
  };

  const handleCloseDialog = () => setOpenDialog(false);

  // 🔹 Save user
  const handleSave = async () => {
    console.log("🔍 authUser:", authUser);
    console.log("🔍 auth.currentUser:", auth.currentUser);

    if (loading) {
      alert("⏳ Still loading authentication. Please wait.");
      return;
    }

    if (!authUser || currentUserRole !== "admin") {
      alert("❌ Unauthorized. Only admins can create/update users.");
      return;
    }

    try {
      if (editId) {
        // Update Firestore directly for edits
        await updateDoc(doc(db, "users", editId), formData);
        setUserList(userList.map((u) => (u.id === editId ? { ...u, ...formData } : u)));
      } else {
        // 🔹 Create user through callable function with ID token
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("No authenticated user found.");

        const token = await currentUser.getIdToken(true); // force refresh token
        console.log("✅ Using ID token for callable:", token.substring(0, 20) + "...");

        const createUser = httpsCallable(functions, "createUser");
        const { data } = await createUser(formData); // token is automatically attached in callable functions

        setUserList([...userList, { id: data.uid, ...data }]);
      }

      handleCloseDialog();
    } catch (err) {
      console.error("❌ Error saving user:", err);
      alert("Error: " + err.message);
    }
  };

  // 🔹 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No authenticated user found.");

      const token = await currentUser.getIdToken(true);
      console.log("✅ Using ID token for delete callable:", token.substring(0, 20) + "...");

      const deleteUser = httpsCallable(functions, "deleteUser");
      await deleteUser({ uid: id });

      setUserList(userList.filter((u) => u.id !== id));
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert("Error: " + err.message);
    }
  };

  // 🔹 Test function button
  const handleTestCallable = async () => {
    console.log("🔍 Running test callable...");
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("⚠️ No auth.currentUser detected!");
      return;
    }

    const token = await currentUser.getIdToken();
    console.log("✅ ID Token:", token.substring(0, 20) + "...");

    try {
      const testFn = httpsCallable(functions, "createUser");
      const result = await testFn({
        email: "dummyuser@test.com",
        password: "dummy123",
        firstName: "Dummy",
        lastName: "User",
        role: "staff",
      });
      console.log("✅ Callable success:", result.data);
    } catch (err) {
      console.error("❌ Callable error:", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="User Management" open={sidebarOpen} setOpen={setSidebarOpen}>
        <Box p={3}><Typography>Loading authentication...</Typography></Box>
      </DashboardLayout>
    );
  }

  const isSpecialAdmin = authUser?.email === "robert.llemit@gmail.com";

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
            <Box display="flex" gap={2}>
              {currentUserRole === "admin" && (
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    + Create User
                  </Button>
                </motion.div>
              )}
              <Button variant="outlined" color="secondary" onClick={handleTestCallable}>
                🔍 Test Callable
              </Button>
            </Box>
          </Box>

          {/* Search + Filter */}
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

          {/* Users Table */}
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

          {/* Create/Edit User Dialog */}
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
                {isSpecialAdmin && <MenuItem value="admin">Admin</MenuItem>}
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
              <Button onClick={handleSave} variant="contained">
                {editId ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </motion.div>
    </DashboardLayout>
  );
}