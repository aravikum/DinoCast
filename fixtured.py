import pandas as pd
import json

data = pd.read_json('comments2.json')
formatted_comments = []

for comment in data['comments']:
    formatted_comment = {
        "model": "dinopod.Comment",
        "pk": int(comment['id']),
        "fields": {
            "id": comment['id'],
            "parent": int(comment['parent']) if comment['parent'] != "" else None,
            "author": comment['author'],
            "text": comment['text'],
            "date": comment['date'],
            "likes": comment['likes'],
            "image": comment['image']
        }
    }
    formatted_comments.append(formatted_comment)


output_data = {'comments': formatted_comments}

# Save to itworked.json
with open('pcomments-fixtured.json', 'w') as outfile:
    json.dump(output_data, outfile, indent=4)

# for comment in data["comments"]:
#     comment_fields = comment.copy()
#     comment_fields.pop("id")
#     fixture_data.append({
#         "model": "yourapp.comment",
#         "pk": int(comment["id"]),
#         "fields": comment_fields
#     })

# fixture_filename = "your_fixture_file.json"

# with open(fixture_filename, "w") as fixture_file:
#     json.dump(fixture_data, fixture_file, indent=2)

# print(f"Fixture file '{fixture_filename}' created successfully.")