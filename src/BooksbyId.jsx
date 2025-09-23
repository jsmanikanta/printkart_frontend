import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Loader from "./Loading";

const Container = styled.div`
  max-width: 800px;
  margin: 30px auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #333;
`;

const Text = styled.p`
  font-size: 1rem;
  margin: 6px 0;
  color: #555;
`;

const SectionTitle = styled.h3`
  margin-top: 24px;
  font-size: 1.4rem;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
  color: #444;
`;

const BooksList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 12px;
`;

const BookItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f9f9f9;
  }

  strong {
    color: #0066cc;
  }
`;

function SellerProfile() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiPath = import.meta.env.VITE_API_PATH;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserSoldBooks() {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiPath}/user/soldbooks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.user && response.data.books) {
          setUser(response.data.user);
          const filteredBooks = response.data.books.filter(
            (book) =>
              book.status === "Accepted" && book.soldstatus === "Instock"
          );
          setBooks(filteredBooks);
        } else {
          setError("Failed to load user books.");
        }
      } catch (error) {
        setError(
          "Error fetching books: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    }

    fetchUserSoldBooks();
  }, [apiPath]);

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  if (loading) return <Loader />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <Container>
      <Title>{user?.fullname}</Title>
      <Text>Email: {user?.email}</Text>
      <Text>Mobile: {user?.mobileNumber}</Text>

      <SectionTitle>Books for Sale</SectionTitle>
      <BooksList>
        {books.length === 0 && <li>No books available</li>}
        {books.map((book) => (
          <BookItem key={book.id} onClick={() => handleBookClick(book.id)}>
            <strong>{book.name}</strong> - ₹{book.updatedPrice ?? book.price}
          </BookItem>
        ))}
      </BooksList>
    </Container>
  );
}

export default SellerProfile;
