# Easecrypto package

A package to help you encrypt/decrypt files and strings with simple functions

## How to use

import the functions you need

<code>
    const {fileEncryptor, fileDecryptor, keyEncryptor, keyDecryptor} = require('easecrypto')
</code>

## Functions

### File Encryptor

#### Example
<code>
    fileEncryptor('./src.json', './dist.ms', privateKey,'r', ((data, err) => {
        if(err){
            console.error(err);
        }else{
            console.log(data);
        }
    }))
</code>

#### Functions parameters

<ul>
    <li><strong>source path</strong> the path of the file to encrypt</li>
    <li><strong>destination path</strong> the path, name and extension of the created file</li>
    <li><strong>encryption key</strong> private key to encrypt the file and decrypt it</li>
    <li><strong>flag</strong> <em>null or 'r'</em> If the destination file already exists, the encryption will stop and returns an error. However, if you wont to overwrite it pass 'r' into the parameter.</li>
    <li><strong>callback</strong> this function is asynchronous. the callback contains err and success message to make sure the process went fine.</li>
</ul>

#### Troubleshooting

make sure you pass the flag parameter! pass 'r' or null. Otherwise it will throw an error.

<code>
    fileEncryptor('./src.json', './dist.ms', privateKey,null, ((data, err) => {
        if(err){
            console.error(err);
        }else{
            console.log(data);
        }
    }))
</code>


### File Decryptor

#### Example
<code>
    fileDecryptor('./dist.ms', './new.json', privateKey, (res => {
        console.log(res);
    }))
</code>

#### Functions parameters

<ul>
    <li><strong>source path</strong> the path of the file to decrypt</li>
    <li><strong>destination path</strong> <em>null or path</em> the path, name and extension of the created file. if the value is null. the callback res will return the content without writing a file to include the data.</li>
    <li><strong>encryption key</strong> private key to encrypt the file and decrypt it</li>
    <li><strong>callback</strong> this function is asynchronous. the callback contains a success message or the content of the file if destination file is set to null</li>
</ul>

#### Troubleshooting

make sure you pass the destination path parameter! either a path value or null. Otherwise it will throw an error.

<code>
    fileDecryptor('./dist.ms', null, privateKey, (res => {
        console.log(res);
    }))
</code>

### Key Encryptor

#### Example
<code>
    const encryptedKey = keyEncryptor("secret password", privateKey)
</code>

#### Functions parameters

<ul>
    <li><strong>key</strong> the string value to encrypt</li>
    <li><strong>encryption key</strong> private key to encrypt the text and decrypt it</li>
</ul>

### Key Decryptor

#### Example
<code>
    const decryptedKey = keyDecryptor(encryptedKey, privateKey)
</code>

#### Functions parameters

<ul>
    <li><strong>encrypted key</strong> the encrypted string value to decrypt</li>
    <li><strong>encryption key</strong> private key to encrypt the text and decrypt it</li>
</ul>
