import React from 'react';
import { AppBar, Toolbar, TextField, Autocomplete, Button } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const SearchBar = ({
    searchQuery, status, species, type, gender, searchSuggestions, handleSearchChange,
    handleFilterChange, setStatus, setSpecies, setType, setGender, isAdmin,
    statusOptions, speciesOptions, typeOptions, genderOptions, toggleFetchType, isFetchingLocations
}) => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Autocomplete
                    freeSolo
                    options={searchSuggestions.map((option) => option?.name)}
                    value={searchQuery}
                    onInputChange={(event, newValue) => handleSearchChange(event, newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Name"
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: <SearchIcon />,
                            }}
                        />
                    )}
                    className="search"
                />
                {isAdmin && (
                    <Autocomplete
                        freeSolo
                        options={statusOptions}
                        value={status || ''}
                        onChange={(event, newValue) => handleFilterChange(setStatus)(event, newValue)}
                        isOptionEqualToValue={(option, value) => option === value}
                        renderInput={(params) => (
                            <TextField {...params} label="Status" variant="outlined" size="small" className="filter" />
                        )}
                    />
                )}
                <Autocomplete
                    freeSolo
                    options={speciesOptions}
                    value={species || ''}
                    onChange={(event, newValue) => handleFilterChange(setSpecies)(event, newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField {...params} label="Species" variant="outlined" size="small" className="filter" />
                    )}
                />
                <Autocomplete
                    freeSolo
                    options={typeOptions}
                    value={type || ''}
                    onChange={(event, newValue) => handleFilterChange(setType)(event, newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField {...params} label="Type" variant="outlined" size="small" className="filter" />
                    )}
                />
                <Autocomplete
                    freeSolo
                    options={genderOptions}
                    value={gender || ''}
                    onChange={(event, newValue) => handleFilterChange(setGender)(event, newValue)}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                        <TextField {...params} label="Gender" variant="outlined" size="small" className="filter" />
                    )}
                />

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={toggleFetchType}
                    sx={{ ml: 'auto' }} // Push the button to the right
                >
                    {isFetchingLocations ? 'Show Characters' : 'Show Locations'}
                </Button>

            </Toolbar>
        </AppBar>
    );
};

export default SearchBar;
