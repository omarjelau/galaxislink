
import { initializeFirebase } from '.';
import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import type { Link, LinkPage, UserProfile, BusinessCard } from '@/lib/types';

const { firestore } = initializeFirebase();

export const firebaseApi = {
  /**
   * Retrieves a user profile by ID.
   * @param userId The ID of the user.
   * @returns The user profile, or null if not found.
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as UserProfile;
      } else {
        console.log("User not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  /**
   * Updates a user profile.
   * @param userId The ID of the user to update.
   * @param data The data to update.
   */
  async updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), data);
      console.log("User updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },

  /**
   * Creates a new link page for a user.
   * @param userId The ID of the user.
   * @param linkPageData The data for the new link page.
   * @returns The ID of the newly created link page.
   */
  async createLinkPage(userId: string, linkPageData: Omit<LinkPage, 'id' | 'userId'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, `users/${userId}/linkPages`), linkPageData);
      console.log("Link page created with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating link page:", error);
      throw error;
    }
  },

  /**
   * Retrieves all link pages for a user.
   * @param userId The ID of the user.
   * @returns An array of link pages, or null if an error occurs.
   */
  async getLinkPages(userId: string): Promise<LinkPage[] | null> {
    try {
      const linkPagesSnapshot = await getDocs(collection(firestore, `users/${userId}/linkPages`));
      return linkPagesSnapshot.docs.map(doc => ({
        id: doc.id,
        userId: userId, // or extract if stored in doc.data()
        ...doc.data()
      })) as LinkPage[];
    } catch (error) {
      console.error("Error fetching link pages:", error);
      return null;
    }
  },

  /**
   * Updates a link page.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page to update.
   * @param data The data to update.
   */
  async updateLinkPage(userId: string, linkPageId: string, data: Partial<LinkPage>): Promise<void> {
    try {
      await updateDoc(doc(firestore, `users/${userId}/linkPages`, linkPageId), data);
      console.log("Link page updated successfully");
    } catch (error) {
      console.error("Error updating link page:", error);
    }
  },

  /**
   * Deletes a link page.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page to delete.
   */
  async deleteLinkPage(userId: string, linkPageId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, `users/${userId}/linkPages`, linkPageId));
      console.log("Link page deleted successfully");
    } catch (error) {
      console.error("Error deleting link page:", error);
    }
  },

  /**
   * Creates a new link for a user's link page.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page.
   * @param linkData The data for the new link.
   * @returns The ID of the newly created link.
   */
  async createLink(userId: string, linkPageId: string, linkData: Omit<Link, 'id' | 'userId' | 'linkPageId' | 'clicks' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firestore, `users/${userId}/linkPages/${linkPageId}/links`), {
        ...linkData,
        clicks: 0,
        createdAt: new Date(),
        userId: userId,
        linkPageId: linkPageId,
      });
      console.log("Link created with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating link:", error);
      throw error;
    }
  },

  /**
   * Retrieves all links for a user's link page.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page.
   * @returns An array of links, or null if an error occurs.
   */
  async getLinks(userId: string, linkPageId: string): Promise<Link[] | null> {
    try {
      const linksSnapshot = await getDocs(
        query(
          collection(firestore, `users/${userId}/linkPages/${linkPageId}/links`),
          orderBy('order', 'asc') // Assuming 'order' is the field for order
        )
      );

      return linksSnapshot.docs.map(doc => ({
        id: doc.id,
        userId: userId, // Or extract if stored in doc.data()
        linkPageId: linkPageId, // Or extract if stored in doc.data()
        ...doc.data()
      })) as Link[];
    } catch (error) {
      console.error("Error fetching links:", error);
      return null;
    }
  },

  /**
   * Updates a link.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page.
   * @param linkId The ID of the link to update.
   * @param data The data to update.
   */
  async updateLink(userId: string, linkPageId: string, linkId: string, data: Partial<Link>): Promise<void> {
    try {
      await updateDoc(doc(firestore, `users/${userId}/linkPages/${linkPageId}/links`, linkId), data);
      console.log("Link updated successfully");
    } catch (error) {
      console.error("Error updating link:", error);
    }
  },

  /**
   * Deletes a link.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page.
   * @param linkId The ID of the link to delete.
   */
  async deleteLink(userId: string, linkPageId: string, linkId: string): Promise<void> {
    try {
      await deleteDoc(doc(firestore, `users/${userId}/linkPages/${linkPageId}/links`, linkId));
      console.log("Link deleted successfully");
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  },

   /**
   * Updates the order of links in a link page.
   * @param userId The ID of the user.
   * @param linkPageId The ID of the link page.
   * @param newOrder An array of links with the new order.
   */
  async updateLinkOrder(userId: string, linkPageId: string, newOrder: Link[]): Promise<void> {
    const batch = writeBatch(firestore);

    newOrder.forEach((link, index) => {
      const linkRef = doc(firestore, `users/${userId}/linkPages/${linkPageId}/links`, link.id);
      batch.update(linkRef, { order: index });
    });

    try {
      await batch.commit();
      console.log("Link order updated successfully");
    } catch (error) {
      console.error("Error updating link order:", error);
      throw error;
    }
  },

  /**
   * Retrieves a business card by ID.
   * @param userId The ID of the user.
   * @param cardId The ID of the business card.
   * @returns The business card, or null if not found.
   */
  async getBusinessCard(userId: string, cardId: string): Promise<BusinessCard | null> {
    try {
      const cardDoc = await getDoc(doc(firestore, `users/${userId}/businessCards`, cardId));
      if (cardDoc.exists()) {
        return { id: cardDoc.id, ...cardDoc.data() } as BusinessCard;
      } else {
        console.log("Business card not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching business card:", error);
      return null;
    }
  },

  /**
   * Updates a business card.
   * @param userId The ID of the user.
   * @param cardId The ID of the business card to update.
   * @param data The data to update.
   */
  async updateBusinessCard(userId: string, cardId: string, data: Partial<BusinessCard>): Promise<void> {
    try {
      await updateDoc(doc(firestore, `users/${userId}/businessCards`, cardId), data);
      console.log("Business card updated successfully");
    } catch (error) {
      console.error("Error updating business card:", error);
    }
  },
};
