# Events API

This API provides endpoints for managing events and their related events.

## OpenAPI Specification
The complete OpenAPI specification can be found in [EventAPI-OpenAPI.json](./EventAPI-OpenAPI.json) in this directory.

## Endpoints

### Get Recent Events
```http
GET /api/events/recent
```

Retrieves a list of recent events with their related events, ordered by creation date.

#### Query Parameters
- `limit` (optional): Maximum number of events to return (default: 10, max: 100)

#### Response
```json
{
  "success": true,
  "events": [
    {
      "mainEvent": {
        "event_id": 1,
        "city": "San Francisco",
        "year": 2024,
        "event_name": "Main Event",
        "event_type": "Significant",
        "event_date": "2024-06-15",
        "parent_event_id": null,
        "metadata": {},
        "created_at": "2024-03-20T12:00:00Z",
        "updated_at": "2024-03-20T12:00:00Z"
      },
      "relatedEvents": [
        {
          "event_id": 2,
          "city": "San Francisco",
          "year": 2024,
          "event_name": "Related Event 1",
          "event_type": "Workshop",
          "event_date": "2024-06-16",
          "parent_event_id": 1,
          "metadata": {},
          "created_at": "2024-03-20T12:00:00Z",
          "updated_at": "2024-03-20T12:00:00Z"
        }
      ]
    }
  ]
}
```

### Search Events
```http
GET /api/events/search
```

Search for events with optional filters for city and year.

#### Query Parameters
- `city` (optional): Filter events by city (case-insensitive)
- `year` (optional): Filter events by year (must be 2024 or later)
- `limit` (optional): Maximum number of events to return (default: 10, max: 100)

#### Response
```json
{
  "success": true,
  "events": [
    {
      "mainEvent": {
        "event_id": 1,
        "city": "San Francisco",
        "year": 2024,
        "event_name": "Main Event",
        "event_type": "Significant",
        "event_date": "2024-06-15",
        "parent_event_id": null,
        "metadata": {},
        "created_at": "2024-03-20T12:00:00Z",
        "updated_at": "2024-03-20T12:00:00Z"
      },
      "relatedEvents": [
        {
          "event_id": 2,
          "city": "San Francisco",
          "year": 2024,
          "event_name": "Related Event 1",
          "event_type": "Workshop",
          "event_date": "2024-06-16",
          "parent_event_id": 1,
          "metadata": {},
          "created_at": "2024-03-20T12:00:00Z",
          "updated_at": "2024-03-20T12:00:00Z"
        }
      ]
    }
  ]
}
```

### Get Event by ID
```http
GET /api/events/{id}
```

Retrieves a specific event by ID. Can return either just the event details or the full structure including related events.

#### Path Parameters
- `id`: The ID of the event to retrieve

#### Query Parameters
- `include_related` (optional): Whether to include related events in the response (default: true)
  - `true`: Returns the full structure with main event and related events
  - `false`: Returns only the queried event details

#### Response (include_related=true)
```json
{
  "success": true,
  "event": {
    "mainEvent": {
      "event_id": 1,
      "city": "San Francisco",
      "year": 2024,
      "event_name": "Main Event",
      "event_type": "Significant",
      "event_date": "2024-06-15",
      "parent_event_id": null,
      "metadata": {},
      "created_at": "2024-03-20T12:00:00Z",
      "updated_at": "2024-03-20T12:00:00Z"
    },
    "relatedEvents": [
      {
        "event_id": 2,
        "city": "San Francisco",
        "year": 2024,
        "event_name": "Related Event 1",
        "event_type": "Workshop",
        "event_date": "2024-06-16",
        "parent_event_id": 1,
        "metadata": {},
        "created_at": "2024-03-20T12:00:00Z",
        "updated_at": "2024-03-20T12:00:00Z"
      }
    ]
  }
}
```

#### Response (include_related=false)
```json
{
  "success": true,
  "event": {
    "event_id": 1,
    "city": "San Francisco",
    "year": 2024,
    "event_name": "Main Event",
    "event_type": "Significant",
    "event_date": "2024-06-15",
    "parent_event_id": null,
    "metadata": {},
    "created_at": "2024-03-20T12:00:00Z",
    "updated_at": "2024-03-20T12:00:00Z"
  }
}
```

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "year",
      "message": "Year must be 2024 or later"
    }
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Event not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch event"
}
```

## Data Types

### Event
- `event_id`: Unique identifier for the event
- `city`: City where the event takes place
- `year`: Year of the event
- `event_name`: Name of the event
- `event_type`: Type of the event (Significant, Minor, Workshop, Conference, Social)
- `event_date`: Date of the event in YYYY-MM-DD format
- `parent_event_id`: ID of the parent event if this is a related event
- `metadata`: Additional metadata for the event
- `created_at`: Timestamp when the event was created
- `updated_at`: Timestamp when the event was last updated 