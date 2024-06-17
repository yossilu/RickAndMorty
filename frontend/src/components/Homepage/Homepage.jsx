import React, { useState, useEffect } from 'react';
import './Homepage.scss';
import { Box, CircularProgress, Grid, Pagination, Typography, Button } from "@mui/material";
import { useQuery, useQueryClient } from 'react-query';
import { axiosPrivate } from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import SearchBar from '../SearchBar/SearchBar';
import CharacterCard from '../CharacterCard/CharacterCard';
import CharacterModal from '../CharacterModal/CharacterModal';

const fetchCharacters = async ({ queryKey }) => {
  const [_key, { page, name, status, species, type, gender }] = queryKey;
  let url = `/rick-and-morty/getAll?page=${page}`;
  if (name) url += `&name=${name}`;
  if (status) url += `&status=${status}`;
  if (species) url += `&species=${species}`;
  if (type) url += `&type=${type}`;
  if (gender) url += `&gender=${gender}`;

  try {
    const { data } = await axiosPrivate.get(url);
    return data;
  } catch (error) {
    throw new Error("Failed to fetch characters");
  }
};

const fetchLocations = async ({ queryKey }) => {
  const [_key, { page }] = queryKey;
  const url = `/rick-and-morty/getLocations?page=${page}`;

  try {
    const { data } = await axiosPrivate.get(url);
    return data;
  } catch (error) {
    throw error;
  }
};

const fetchSearchSuggestions = async ({ queryKey }) => {
  const [_key, search] = queryKey;
  const url = `/rick-and-morty/getAll?search=${search}`;

  try {
    const { data } = await axiosPrivate.get(url);
    return data.results;
  } catch (error) {
    throw new Error("Failed to fetch search suggestions");
  }
};

const fetchOptions = async (field) => {
  const url = `/rick-and-morty/getOptions?field=${field}`;

  try {
    const { data } = await axiosPrivate.get(url);
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch options for field ${field}`);
  }
};

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState(null);
  const [species, setSpecies] = useState(null);
  const [type, setType] = useState(null);
  const [gender, setGender] = useState(null);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const { auth } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [genderOptions, setGenderOptions] = useState([]);
  const [fetchType, setFetchType] = useState('characters');

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery(
    [fetchType, { page, name: searchQuery, status, species, type, gender }],
    fetchType === 'characters' ? fetchCharacters : fetchLocations,
    {
      keepPreviousData: true,
      retry: false,
      onError: (err) => {
        if (err?.response?.data?.message)
          alert(err?.response?.data?.message || "An error occurred while fetching locations");
        setFetchType('characters');
      }
    }
  );

  useEffect(() => {
    const loadOptions = async () => {
      const statusOptions = await fetchOptions('status');
      const speciesOptions = await fetchOptions('species');
      const typeOptions = await fetchOptions('type');
      const genderOptions = await fetchOptions('gender');

      setStatusOptions(statusOptions);
      setSpeciesOptions(speciesOptions);
      setTypeOptions(typeOptions);
      setGenderOptions(genderOptions);
    };

    loadOptions();
  }, []);

  useEffect(() => {
    setIsAdmin(auth?.roles?.includes('ADMIN'));
  }, [auth]);

  const handleSearchChange = (event, value) => {
    setSearchQuery(value);
    setPage(1);

    if (value) {
      queryClient.fetchQuery(['searchSuggestions', value], fetchSearchSuggestions).then(setSearchSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleFilterChange = (setter) => (event, value) => {
    setter(value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCardClick = (data) => {
    if (isAdmin) {
      setSelectedData(data);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedData(null);
  };

  const toggleFetchType = () => {
    setFetchType((prev) => (prev === 'characters' ? 'locations' : 'characters'));
  };

  return (
    <div className="rick-and-morty-gallery">
      <SearchBar
        searchQuery={searchQuery}
        status={status}
        species={species}
        type={type}
        gender={gender}
        searchSuggestions={searchSuggestions}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        setStatus={setStatus}
        setSpecies={setSpecies}
        setType={setType}
        setGender={setGender}
        isAdmin={isAdmin}
        statusOptions={statusOptions}
        speciesOptions={speciesOptions}
        typeOptions={typeOptions}
        genderOptions={genderOptions}
        toggleFetchType={toggleFetchType}
        isFetchingLocations={fetchType === 'locations'}
      />
      <Box sx={{ p: 2 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', color: 'red' }}>
            <Typography variant="body1">{error.message}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3} className="gallery">
            {data?.results.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <CharacterCard
                  data={item}
                  isAdmin={isAdmin}
                  onClick={() => handleCardClick(item)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={data?.info.pages || 1}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
      <CharacterModal
        open={openModal}
        data={selectedData}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default Homepage;
