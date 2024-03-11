import React, { useState } from "react";
import { ChakraProvider, Box, VStack, Heading, FormControl, FormLabel, Input, Button, useToast, Table, Thead, Tbody, Tr, Th, Td, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const apiBaseUrl = "https://backengine-et54.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", expiryDate: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setAccessToken(data.accessToken);
        setIsLoggedIn(true);
        toast({
          title: "Login successful!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to log in!",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.status === 204) {
        toast({
          title: "Sign-up successful!",
          description: "Please log in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const data = await response.json();
        toast({
          title: "Failed to sign up!",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddItem = () => {
    setItems([...items, newItem]);
    setNewItem({ name: "", expiryDate: "" });
    onClose();
  };

  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(updatedItems);
  };

  if (!isLoggedIn) {
    return (
      <ChakraProvider>
        <VStack spacing={4} align="stretch" m={5}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button colorScheme="blue" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="outline" onClick={handleSignUp}>
            Sign Up
          </Button>
        </VStack>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box m={5}>
        <Heading mb={4}>Expiry Tracker</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={onOpen}>
          Add New Item
        </Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add a New Expiry Item</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Item Name</FormLabel>
                <Input placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Expiry Date</FormLabel>
                <Input type="date" value={newItem.expiryDate} onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleAddItem}>
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>Item Name</Th>
              <Th>Expiry Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr key={index}>
                <Td>{item.name}</Td>
                <Td>{item.expiryDate}</Td>
                <Td>
                  <IconButton aria-label="Delete item" icon={<FaTrash />} onClick={() => handleDeleteItem(index)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </ChakraProvider>
  );
};

export default Index;
