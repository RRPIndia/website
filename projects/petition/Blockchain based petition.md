# What is a petition?
According to me petition is a system where anyone can put his proposal and others can support that proposal.

# what are must for petition
In my opinion a petition must have following properties
1. server admins must not be able to interfere with process without being caught.
2. server admin must not be able to interfere with results ever 
3. ideally one person must not vote twice. ( Atleast must not be able to spam vote )
4. voters must be able to verify their votes. 
5. one should be able to verify other's vote.
6. record of votes must never disappear.

# How can a system be designed which satisfies above condition without putting faith in anyone?

it is impossible to be absolute sure because someone has to be trusted, maybe the CPU is tampered.
Insted, focus should be to make it as secure or more as banking system. 

# What design I am proposing?
1. Use Oasis TEE. secure hardware backed server.
2. Put votes with voter ID on Blockchain
3. phone OTP Verification for every user on Oasis TEE.
4. give voter ID to every voter for verification on Blockchain.
5. Every vote most contain program code hash using which voting happened 
6. Put voter ID, vote, timestamp, program code hash on Blockchain.

## voter ID
Every user shall use his/her phone number to sign up or login on a website.
upon successful sign up, a public voter ID shall be created in such a way that phone number can't be guessed with voter ID.
using voter ID, one can vote a petition, remove vote from petition and later see his/her votes on the website. 

## immutable verifiable authenticity 
voter ID, timestamp of vote, hash of Petition, and type of vote will be put on Blockchain so that anyone can verify authenticity of votes. 
all the above parameters will remain unencrypted.



## workflow
1. 
