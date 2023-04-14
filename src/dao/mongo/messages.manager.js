import { MM_MONGO } from '../mongo/database.manager.js'

class MessageManager {
  async getMessages() {
    const messages = await MM_MONGO.getItems()
    return messages
  }

  async addMessage(fields) {
    const createMessage = new Message({ user: fields.user, message: fields.message })
    const newMessage = createMessage.getMessage()

    await MM_MONGO.createMessage(newMessage)

    return {
      newMessage
    }
  }

  async deleteMessages() {
    const itemDeleted = await MM_MONGO.deleteMessage()

    return {
      itemDeleted
    }
  }
}

const MM = new MessageManager()

export { MM }