# Perses

## About

Perses is a next generation exercise editor based on [Khan Academy's Perseus](https://github.com/Khan/perseus). It uses newer features of React like contexts and hooks that were not available when Perseus was first developed. As such, I believe it makes for a simpler interface for the developer to integrate into your application.

## Usage

There are two main components in Perses:

- `QuestionEditor`: Provides a full editor to create or edit questions. You only need to wrap it in a component that can retrieve and store the question objects from the data store (i.e. a database, json file, or localStorage).
- `Renderer`: This component will render a question object, and will update the user interactions by storing the state in the renderer context. You will have to wrap this in a `RendererContextProvider` component.

## Example

A minimal editor example could be:

```javascript
import React from "react"
```
