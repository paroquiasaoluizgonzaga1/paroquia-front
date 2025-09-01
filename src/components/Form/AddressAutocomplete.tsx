import { useState, useEffect, useRef } from 'react';
import { Input } from './Input';
import { Box, Text } from '@chakra-ui/react';
import { Loader } from '@googlemaps/js-api-loader';
import { useDebouncedCallback } from '@/utils/useDebouncedCallback';

interface AddressSuggestion {
    placePrediction: {
        text: {
            text: string;
            matches: Array<{
                length: number;
                offset: number;
            }>;
        };
        place: {
            id: string;
            displayName: {
                text: string;
                languageCode: string;
            };
            formattedAddress: string;
        };
        toPlace(): google.maps.Place;
    };
}

interface AddressAutocompleteProps {
    onAddressSelect?: (address: string, latitude: number, longitude: number) => void;
    placeholder?: string;
    label?: string;
    isRequired?: boolean;
    errorText?: string;
    defaultValue?: string;
}

export function AddressAutocomplete({
    onAddressSelect,
    placeholder = 'Digite o endereço...',
    label = 'Endereço',
    isRequired = false,
    defaultValue,
    errorText,
}: AddressAutocompleteProps) {
    const [inputValue, setInputValue] = useState<string>(defaultValue ?? '');
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const sessionToken = useRef<google.maps.AutocompleteSessionToken | null>(null);
    const placesLibrary = useRef<google.maps.PlacesLibrary | null>(null);

    const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places'],
    });

    useEffect(() => {
        const loadGooglePlacesAPI = async () => {
            try {
                const { Place, AutocompleteSessionToken, AutocompleteSuggestion } = (await loader.importLibrary(
                    'places'
                )) as google.maps.PlacesLibrary;

                placesLibrary.current = {
                    Place,
                    AutocompleteSessionToken,
                    AutocompleteSuggestion,
                };
                sessionToken.current = new AutocompleteSessionToken();
            } catch (error) {
                console.error('Erro ao carregar Google Places API:', error);
            }
        };

        loadGooglePlacesAPI();
    }, []);

    const getSuggestions = async (inputValue: string) => {
        if (!placesLibrary.current || !sessionToken.current) return;

        try {
            const { AutocompleteSuggestion, AutocompleteSessionToken } = placesLibrary.current;

            sessionToken.current = new AutocompleteSessionToken();

            const request = {
                input: inputValue,
                sessionToken: sessionToken.current,
                locationRestriction: {
                    west: -51.5,
                    north: -29.5,
                    east: -50.8,
                    south: -30.2,
                },
                includedPrimaryTypes: ['geocode'],
                language: 'pt-BR',
                region: 'br',
            };

            const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

            if (suggestions && suggestions.length > 0) {
                setSuggestions(suggestions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } catch (error) {
            console.error('Erro ao buscar sugestões:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);
        if (!value.trim() || value.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        getSuggestionsDebounced(inputValue);
    };

    const getSuggestionsDebounced = useDebouncedCallback(getSuggestions, 500);

    const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
        const place = suggestion.placePrediction.toPlace();

        await place.fetchFields({ fields: ['location'] });
        const displayText = suggestion.placePrediction.text.text;

        const location = place.location;

        setShowSuggestions(false);

        setInputValue(displayText);

        if (onAddressSelect) {
            onAddressSelect(displayText, location.lat(), location.lng());
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    };

    return (
        <Box position="relative">
            <Input
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleInputBlur}
                onFocus={() => inputValue.length >= 3 && setShowSuggestions(true)}
                placeholder={placeholder}
                label={label}
                isRequired={isRequired}
                errorText={errorText}
            />

            {showSuggestions && suggestions.length > 0 && (
                <Box
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    zIndex={1000}
                    bg={{ base: 'white', _dark: 'gray.800' }}
                    border="1px solid"
                    borderColor={{ base: 'gray.200', _dark: 'gray.600' }}
                    borderRadius="md"
                    boxShadow="lg"
                    maxH="200px"
                    overflowY="auto"
                >
                    <Box as="ul" listStyleType="none" m={0} p={0}>
                        {suggestions.map((suggestion, index) => {
                            const placePrediction = suggestion.placePrediction;
                            const mainText = placePrediction.text.text;
                            const secondaryText =
                                placePrediction.place?.formattedAddress ||
                                placePrediction.place?.displayName?.text ||
                                '';

                            return (
                                <Box
                                    as="li"
                                    key={`${placePrediction.place?.id || index}-${index}`}
                                    px={4}
                                    py={2}
                                    cursor="pointer"
                                    _hover={{
                                        bg: { base: 'gray.100', _dark: 'gray.700' },
                                    }}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <Text fontWeight="medium" color={{ base: 'gray.900', _dark: 'white' }}>
                                        {mainText}
                                    </Text>
                                    {secondaryText && (
                                        <Text fontSize="sm" color={{ base: 'gray.600', _dark: 'gray.400' }}>
                                            {secondaryText}
                                        </Text>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            )}
        </Box>
    );
}
