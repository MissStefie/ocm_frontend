import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { TableVirtuoso } from "react-virtuoso";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Search, Edit, Delete } from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import "../styles/AdminPanelStyle.css";

const columns = [
  { label: "#", dataKey: "id" },
  { label: "Nombre", dataKey: "name" },
  { label: "Correo", dataKey: "email" },
  { label: "Contacto", dataKey: "tel" },
  {
    label: "Personas registradas",
    dataKey: "num_people",
  },
  { label: "Fecha de registro", dataKey: "createdAt" },
  { label: "Acciones", dataKey: "actions" },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => <div {...props} ref={ref} />),
  Table: (props) => <table {...props} />,
  TableHead: React.forwardRef((props, ref) => <thead {...props} ref={ref} />),
  TableBody: React.forwardRef((props, ref) => <tbody {...props} ref={ref} />),
  TableRow: (props) => <tr {...props} />,
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          sx={{ backgroundColor: "background.paper" }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row, handleDelete, handleEditClick) {
  return (
    <React.Fragment>
      {columns.map((column) => {
        if (column.dataKey === "actions") {
          return (
            <TableCell key={column.dataKey} align="center">
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleEditClick(row)}
                startIcon={<Edit />}
              >
                Editar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleDelete(row.id)}
                startIcon={<Delete />}
              >
                Eliminar
              </Button>
            </TableCell>
          );
        } else {
          return (
            <TableCell key={column.dataKey}>{row[column.dataKey]}</TableCell>
          );
        }
      })}
    </React.Fragment>
  );
}

export default function AdminPanel() {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchRegisters = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/register`);
      setRows(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
    }
  };

  useEffect(() => {
    fetchRegisters();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    return (
      (row.name &&
        row.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.email &&
        row.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (row.tel && row.tel.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleAddClick = () => {
    setIsEditing(false);
    setSelectedRow(null);
    formik.resetForm();
    setOpenDialog(true);
  };

  const handleEditClick = (row) => {
    setIsEditing(true);
    setSelectedRow(row);
    formik.setValues({
      name: row.name,
      email: row.email,
      tel: row.tel,
      num_people: row.num_people,
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      tel: "",
      num_people: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("El nombre es obligatorio")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
      email: Yup.string()
        .email("Correo inválido")
        .required("El correo es obligatorio"),
      tel: Yup.string()
        .required("El teléfono es obligatorio")
        .matches(/^[0-9]+$/, "Solo se permiten números"),
      num_people: Yup.number()
        .required("El número de personas es obligatorio")
        .min(1, "Debe ser al menos 1")
        .max(5, "No puede ser mayor a 5"),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          await axios.put(
            `${process.env.REACT_APP_API_URL}/register/${selectedRow.id}`,
            values
          );
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === selectedRow.id ? { ...row, ...values } : row
            )
          );
        } else {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/register`,
            values
          );
          setRows((prev) => [...prev, response.data]);
        }
        setOpenDialog(false);
      } catch (error) {
        console.error("Error al guardar el registro:", error);
      }
    },
  });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/register/${id}`);
      fetchRegisters();
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
    }
  };

  return (
    <div>
      <h1 className="title-admin-panel">Panel de Administrador</h1>
      <Box className="center-container">
        <Box className="textfield-box">
          <TextField
            label="Buscar"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            size="small"
          />
        </Box>
        <Box className="button-box">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAddClick}
            size="small"
            startIcon={<PersonAddIcon />}
          >
            Agregar
          </Button>
        </Box>
      </Box>

      <div className="table-container">
        <Paper className="table-paper">
          <TableVirtuoso
            data={filteredRows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={(index, row) =>
              rowContent(index, row, handleDelete, handleEditClick)
            }
          />
        </Paper>
      </div>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          {isEditing ? "Editar Registro" : "Agregar Registro"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              label="Correo"
              variant="outlined"
              fullWidth
              margin="normal"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              label="Teléfono"
              variant="outlined"
              fullWidth
              margin="normal"
              name="tel"
              value={formik.values.tel}
              onChange={formik.handleChange}
              error={formik.touched.tel && Boolean(formik.errors.tel)}
              helperText={formik.touched.tel && formik.errors.tel}
            />
            <TextField
              label="Número de personas"
              variant="outlined"
              fullWidth
              margin="normal"
              name="num_people"
              value={formik.values.num_people}
              onChange={formik.handleChange}
              error={
                formik.touched.num_people && Boolean(formik.errors.num_people)
              }
              helperText={formik.touched.num_people && formik.errors.num_people}
            />
            <DialogActions>
              <Button
                onClick={handleDialogClose}
                color="primary"
                startIcon={<Delete />}
              >
                Cancelar
              </Button>
              <Button type="submit" color="primary" startIcon={<Edit />}>
                {isEditing ? "Actualizar" : "Agregar"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
