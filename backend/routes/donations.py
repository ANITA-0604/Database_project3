from flask import Blueprint, request, jsonify
from utils.db import get_db_connection
from routes.auth import token_required
donations_bp = Blueprint('donations', __name__, url_prefix='/donations')


@donations_bp.route('/accept', methods=['POST'])
@token_required
def donate_item():
    try:
        data = request.json

        connection = get_db_connection()
        cursor = connection.cursor()

        auth_user = request.user  # `request.user` is set by the `@token_required` decorator
        cursor.execute(
            """
            SELECT R.rDescription
            FROM Person P
            LEFT JOIN Act A ON P.userName = A.userName
            LEFT JOIN Role R ON A.roleID = R.roleID
            WHERE P.userName = %s
            """,
            (auth_user['userName'],)
        )
        role = cursor.fetchone()

        if not role or role['rDescription'] != 'Staff':
            return jsonify({"success": False, "message": "Submitting user is not authorized (not staff)."}), 403
        
        # Insert or update donor
        donor_username = data.get('donorData')
        cursor.execute("SELECT * FROM Person WHERE userName = %s", (donor_username,))
        donor = cursor.fetchone()

        if not donor:
            return jsonify({"success": False, "message": "Donor not found in the database."}), 404


        # Insert item
        item_data = data.get('itemData')
        main_category = item_data['mainCategory']
        sub_category = item_data['subCategory']

        cursor.execute(
            "SELECT * FROM Category WHERE mainCategory = %s AND subCategory = %s",
            (main_category, sub_category)
        )
        category = cursor.fetchone()

        if not category:
            # Insert new category if it doesn't exist
            cursor.execute(
                "INSERT INTO Category (mainCategory, subCategory, catNotes) VALUES (%s, %s, %s)",
                (main_category, sub_category, "Auto-inserted by system")
            )

        cursor.execute(
            """
            INSERT INTO Item (iDescription, photo, color, isNew, hasPieces, material, mainCategory, subCategory)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                item_data['iDescription'],
                item_data['photo'],
                item_data['color'],
                item_data['isNew'],
                item_data['hasPieces'],
                item_data['material'],
                item_data['mainCategory'],
                item_data['subCategory'],
            )
        )
        item_id = cursor.lastrowid

        # Insert pieces with locations
        piece_data = data.get('pieceData', [])
        for idx, piece in enumerate(piece_data):
            # Check or insert location
            room_num = piece['location']['roomNum']
            shelf_num = piece['location']['shelfNum']
    
            # Check if the location exists
            cursor.execute(
                """
                SELECT * FROM Location WHERE roomNum = %s AND shelfNum = %s
                """,
                (room_num, shelf_num)
            )
            location = cursor.fetchone()
    
            if not location:
                # Insert new location if it doesn't exist
                cursor.execute(
                    """
                    INSERT INTO Location (roomNum, shelfNum, shelfDescription)
                    VALUES (%s, %s, %s)
                    """,
                    (room_num, shelf_num, "Auto-inserted location")
                )

            # Insert piece
            cursor.execute(
                """
                INSERT INTO Piece (itemID, pieceNum, pDescription, length, width, height, roomNum, shelfNum)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    item_id,
                    idx + 1,
                    piece['pDescription'],
                    piece['length'],
                    piece['width'],
                    piece['height'],
                    room_num,
                    shelf_num,
                )
            )


        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"success": True, "message": "Item donated successfully!"}), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Error while donating item", "error": str(e)}), 500
