import Message from "../models/message.model.js";

export const getLastMessagesFromRoom = async (room) => {
  try {
    const roomMessages = await Message.aggregate([
      { $match: { to: room } },
      { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
    ]);
    return roomMessages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sortRoomMessagesByDate = (messages) => {
  return messages.sort((a, b) => {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = `${date1[2]}${date1[0]}${date1[1]}`;
    date2 = `${date2[2]}${date2[0]}${date2[1]}`;

    return date1 < date2 ? -1 : 1;
  });
};
