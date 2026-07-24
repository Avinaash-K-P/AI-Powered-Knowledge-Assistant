from pydantic import BaseModel


class ChatAskRequest(BaseModel):
    question: str


class SourceResponse(BaseModel):
    document_id: int | None = None
    filename: str | None = None
    chunk_index: int | None = None


class ChatAskResponse(BaseModel):
    answer: str
    sources: list[SourceResponse]