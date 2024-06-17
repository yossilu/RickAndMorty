const axios = require('axios');
const asyncHandler = require('express-async-handler');

const BASE_URL = 'https://rickandmortyapi.com/api';

const getAll = asyncHandler(async (req, res) => {
    try {
      const { page = 1, name, status, species, type, gender } = req.query;
      let url = `${BASE_URL}/character?page=${page}`;
      if (name) url += `&name=${name}`;
      if (status) url += `&status=${status}`;
      if (species) url += `&species=${species}`;
      if (type) url += `&type=${type}`;
      if (gender) url += `&gender=${gender}`;
  
      const response = await axios.get(url);
      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 404) {
        res.status(404).json({ message: "Not found" });
      } else if (error instanceof SyntaxError) {
        res.status(500).json({ message: "Error parsing JSON" });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });
const getOne = asyncHandler(async (req, res) => {
  try {
    const id = req.params.ramId;
    const response = await axios.get(`${BASE_URL}/${id}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Character not found" });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({ message: "Error parsing JSON" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});


const getLocations = asyncHandler(async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${BASE_URL}/location?page=${page}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching locations:", error);
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Not found" });
    } else if (error instanceof SyntaxError) {
      res.status(500).json({ message: "Error parsing JSON" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});


const getOptions = asyncHandler(async (req, res) => {
    const { field } = req.query;
    const response = await axios.get(BASE_URL+'/character');
    const allCharacters = response.data.results;
  
    let options = [];
  
    switch (field) {
      case 'status':
        options = [...new Set(allCharacters?.map(char => char.status))];
        break;
      case 'species':
        options = [...new Set(allCharacters?.map(char => char.species))];
        break;
      case 'type':
        options = [...new Set(allCharacters?.map(char => char.type).filter(type => type))]; // Filter out empty types
        break;
      case 'gender':
        options = [...new Set(allCharacters?.map(char => char.gender))];
        break;
      default:
        break;
    }
  
    res.json(options);
  });

module.exports = {
  getAll,
  getOne,
  getOptions,
  getLocations
};
