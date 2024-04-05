import React from "react";
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Button from "@mui/material/Button";
import Addcar from "./Addcar";
import Editcar from "./Editcar";
function CarList() {
	const [cars, setCars] = useState([]);

	const pagination = true;
	const [colDefs] = useState([
		{ field: "brand", filter: true },
		{ field: "model", filter: true },
		{ field: "color", filter: true, width: 100 },
		{ field: "fuel", filter: true, width: 100 },
		{ field: "modelYear", filter: true, width: 200 },
		{ field: "price", filter: true },
		{
			cellRenderer: (params) => (
				<Button
					size="small"
					color="error"
					onClick={() => deleteCar(params.data._links.car.href)}
				>
					Delete
				</Button>
			),
			width: 150,
		},
		{
			cellRenderer: (params) => (
				<Editcar updateCar={updateCar} car = {params.data}/>
			),
			width: 150,
		},
	]);
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const response = await fetch(
				"https://carrestservice-carshop.rahtiapp.fi/cars",
			);
			if (!response.ok) {
				throw new Error("Error in fetch: " + response.statusText);
			}
			const data = await response.json();
			setCars(data._embedded.cars);
		} catch (err) {
			console.error(err);
		}
	};
	const deleteCar = async (url) => {
		if (window.confirm("Are you sure")) {
			try {
				const response = await fetch(url, { method: "DELETE" });
				if (!response.ok) {
					throw new Error("Error in fetch: " + response.statusText);
				}
				await fetchData();
			} catch (err) {
				console.error(err);
			}
		}
	};
	const saveCar = async (car) => {
		try {
			const response = await fetch(
				"https://carrestservice-carshop.rahtiapp.fi/cars",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(car),
				},
			);

			if (!response.ok) {
				throw new Error("Error in fetch: " + response.statusText);
			}
			await fetchData();
		} catch (err) {
			console.error(err);
		}
	};
	const updateCar = async (car,link) => {
		try {
			const response = await fetch(
				link,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(car),
				},
			);

			if (!response.ok) {
				throw new Error("Error in fetch: " + response.statusText);
			}
			await fetchData();
		} catch (err) {
			console.error(err);
		}
	};
	return (
		<div className="ag-theme-quartz" style={{ height: 500 }}>
			<Addcar saveCar={saveCar} />
			<AgGridReact
				rowData={cars}
				columnDefs={colDefs}
				pagination={pagination}
			/>
		</div>
	);
}

export default CarList;
