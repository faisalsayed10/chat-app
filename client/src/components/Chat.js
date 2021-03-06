import { useMutation } from "@apollo/client";
import { CopyIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import copy from "copy-text-to-clipboard";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { DELETE_MESSAGE } from "../schema/mutations";
import Loading from "./Loading";
import parse from "html-react-parser";
import "../styles.css";

function Chat({
  user,
  dummy,
  loading,
  data,
  subscribeToNewMessages,
  subscribeToDeletedMessages,
}) {
  const [deleteMessage] = useMutation(DELETE_MESSAGE);

  useEffect(() => {
    subscribeToNewMessages();
    subscribeToDeletedMessages();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [loading, data, dummy]);

  if (loading) return <Loading />;

  return (
    <>
      {data ? (
        data?.messages.map(({ message, author, id, isVerified }) => (
          <Box
            key={id}
            display="flex"
            justifyContent={author === user ? "flex-end" : "flex-start"}
            my="4"
          >
            {author !== user && (
              <Box
                height="50px"
                width="50px"
                marginRight="0.5em"
                border="2px solid #e5e6ea"
                borderRadius="full"
                align="center"
                fontSize="18pt"
                pt="5px"
              >
                {author.slice(0, 2).toUpperCase()}
              </Box>
            )}
            <Box
              backgroundColor={user === author ? "#58bf56" : "#e5e6ea"}
              color={user === author ? "white" : "black"}
              px="2"
              py="0.7em"
              borderRadius="sm"
              maxW="60%"
              fontSize="md"
            >
              <span style={{ fontWeight: "bold" }}>
                {user === author ? "You" : author}{" "}
                {isVerified ? (
                  <img
                    style={{ display: "inline" }}
                    width="20"
                    height="20"
                    alt="verified_user"
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Twitter_Verified_Badge.svg"
                  />
                ) : null}
                :
              </span>{" "}
              {parse(message)}
            </Box>
            {user === author ? (
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  size="xs"
                  variant="outline"
                  ml="2"
                  padding="0"
                  transition="all 0.2s"
                />
                <MenuList>
                  <MenuItem
                    icon={<CopyIcon />}
                    onClick={() => {
                      let stringified = message
                        .toString()
                        .replaceAll(/<[^>]*>/gi, "");
                      copy(stringified);
                    }}
                  >
                    Copy
                  </MenuItem>
                  <MenuItem
                    icon={<DeleteIcon />}
                    type="submit"
                    onClick={() => deleteMessage({ variables: { id } })}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            ) : null}
          </Box>
        ))
      ) : (
        <Text fontSize="2xl" align="center">
          No messages to display.
        </Text>
      )}
    </>
  );
}

export default Chat;
