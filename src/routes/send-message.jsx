import { identity, getPaginatedDMThread, sendDMMessage, checkPartyAccessGroups } from "deso-protocol";
import { useContext } from "react";
import { UserContext } from "../contexts";
import { useState, useEffect } from "react";

export const SendMessages = () => {
  const { currentUser, isLoading } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState('');
  const [dmThread, setDmThread] = useState();

  const DEFAULT_KEY_MESSAGING_GROUP_NAME = 'default-key';

  useEffect(()=> {
    if (!currentUser) return;
    (async () => {
      const messages = await getPaginatedDMThread({
        UserGroupOwnerPublicKeyBase58Check: currentUser.PublicKeyBase58Check,
        UserGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
        PartyGroupOwnerPublicKeyBase58Check: "BC1YLgUCRPPtWmCwvigZay2Dip6ce1UHd2TqniZci8qgauCtUo8mQDW",
        PartyGroupKeyName: DEFAULT_KEY_MESSAGING_GROUP_NAME,
        MaxMessagesToFetch: 25,
        StartTimeStamp: new Date().valueOf() * 1e6,
      });
      console.log("MESSAGES! : ", messages)
    })();
  }, [currentUser])


  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <p>
          You are currently logged in as{" "}
          {currentUser.ProfileEntryResponse?.Username ??
            currentUser.PublicKeyBase58Check}
        </p>
      )}
      <div className="message-thread">
        Message Thread
      </div>
      <div className="message-area">
        <textarea type='text' 
        value={newMessage}
        onChange={(e)=> {
          setNewMessage(e.target.value)
        }}
        >
        </textarea>
        <button onClick={async ()=> {
          console.log("Sending Message!!")
          const checkResponse = await checkPartyAccessGroups({
            SenderPublicKeyBase58Check: "BC1YLjSWVAtazEyFeazqBSQYiPHaav3HxzsQFeyEaQTLu2vdDrg3NMB",
            SenderAccessGroupKeyName: 'default-key',
            RecipientPublicKeyBase58Check: 
        "BC1YLgUCRPPtWmCwvigZay2Dip6ce1UHd2TqniZci8qgauCtUo8mQDW",
            RecipientAccessGroupKeyName: 'default-key',
          });
          console.log("CHECK RESPONSE: ", checkResponse);
          const encryptedMessage = await identity.encryptMessage(
            checkResponse.RecipientAccessGroupPublicKeyBase58Check,
              newMessage,
          );
          sendDMMessage({
            EncryptedMessageText: encryptedMessage,
            MinFeeRateNanosPerKB: 1000,
            RecipientAccessGroupKeyName: 'default-key',
            RecipientAccessGroupOwnerPublicKeyBase58Check: "BC1YLgD3Puxk6wk4tdPyKaQxENJR9u6Pc9biprvvvVrveDGr8eqro4N",
            SenderAccessGroupKeyName: 'default-key',
            SenderAccessGroupOwnerPublicKeyBase58Check: "BC1YLjSWVAtazEyFeazqBSQYiPHaav3HxzsQFeyEaQTLu2vdDrg3NMB",
            SenderAccessGroupPublicKeyBase58Check: "BC1YLj361ujN4XPuAatxxK8sSVzvqLqVYij29efMyGGr56WxTtLFHwS",
            ExtraData: {},
            RecipientAccessGroupPublicKeyBase58Check: checkResponse.RecipientAccessGroupPublicKeyBase58Check

          })
        }}>Send Message</button>
      </div>
    </>
  );
};
