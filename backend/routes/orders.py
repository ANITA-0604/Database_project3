# routes/orders.py
from flask import Blueprint, request, jsonify, current_app
import jwt
from utils.db import get_db_connection
from routes.auth import token_required 
orders_bp = Blueprint('orders', __name__, url_prefix='/orders')
SECRET_KEY = "your_secret_key"  
@orders_bp.route('/find', methods=['GET', 'POST'])
@token_required
def find_order_items():
    order_id = request.args.get('orderID')
    if not order_id:
        return jsonify({'error': 'no ordeID??'}), 400

    connection = get_db_connection()
    try:
        with connection.cursor() as cursor:
            sql = """
                SELECT  *   
                FROM ItemIn
                JOIN Piece On Piece.itemID = ItemIn.itemID
                WHERE ItemIn.orderID = %s;
            """
            cursor.execute(sql, (order_id,))
            items = cursor.fetchall()
            return jsonify({'items': items}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        connection.close()

@orders_bp.route('/start', methods=['POST'])
@token_required
def start_order():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if logged-in user is staff
        auth_user = request.user  # Set by @token_required
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
        print(auth_user)
        role = cursor.fetchone()

        if not role or role['rDescription'] != 'Staff':
            return jsonify({"success": False, "message": "Only staff members can start orders."}), 403

        # Prompt for client's username and validate
        data = request.json
        client_username = data.get('clientUsername')
        cursor.execute("SELECT * FROM Person WHERE userName = %s", (client_username,))
        client = cursor.fetchone()

        if not client:
            return jsonify({"success": False, "message": "Client username is invalid or does not exist."}), 404

        # Assign a new order ID by inserting a new order
        cursor.execute(
            """
            INSERT INTO Ordered (orderDate, orderNotes, supervisor, client)
            VALUES (NOW(), %s, %s, %s)
            """,
            ("Order initiated by staff", auth_user['userName'], client_username)
        )
        order_id = cursor.lastrowid

        # Save order ID in jwt
        updated_payload = {
            "userName": auth_user['userName'],
            "role": role['rDescription'],
            "orderID": order_id  # Add the new orderID to the token
        }
        new_token = jwt.encode(updated_payload, SECRET_KEY, algorithm="HS256")

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({
            "success": True,
            "orderID": order_id,
            "message": "Order started successfully.",
            "token": new_token  # Return the updated token to the client
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": "Error starting order", "error": str(e)}), 500

@orders_bp.route('/categories', methods=['GET'])
@token_required
def get_categories():
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT DISTINCT mainCategory, subCategory FROM Category")
        categories = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({"success": True, "categories": categories}), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error fetching categories", "error": str(e)}), 500

@orders_bp.route('/available-items', methods=['GET'])
@token_required
def get_available_items():
    try:
        main_category = request.args.get('mainCategory')
        sub_category = request.args.get('subCategory')
        print(main_category, sub_category)
        if not main_category or not sub_category:
            return jsonify({"success": False, "message": "Missing category parameters"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT * FROM Item
            WHERE mainCategory = %s AND subCategory = %s AND isOrdered = FALSE
            """,
            (main_category, sub_category)
        )
        items = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({"success": True, "items": items}), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error fetching available items", "error": str(e)}), 500

@orders_bp.route('/add-item', methods=['POST'])
@token_required
def add_item_to_order():
    try:
        # Decode orderID from token
        auth_user = request.user
        print(auth_user)
        order_id = request.user.get('orderID')  # Assume `@token_required` sets `request.user`
        if not order_id:
            return jsonify({"success": False, "message": "No active order found. Please create an order first."}), 400

        data = request.json
        cart_items = data.get('cartItems')

        if not cart_items or not isinstance(cart_items, list):
            return jsonify({"success": False, "message": "Invalid or missing cart items"}), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        results = []

        for item in cart_items:
            item_id = item.get('itemID')
            if not item_id:
                results.append({"itemID": None, "success": False, "message": "No itemID provided"})
                continue

            # Check if the item is already ordered
            cursor.execute(
                """
                SELECT isOrdered FROM Item WHERE itemID = %s
                """,
                (item_id,)
            )
            item_record = cursor.fetchone()

            if not item_record:
                results.append({"itemID": item_id, "success": False, "message": "Item not found"})
                continue

            if item_record['isOrdered']:
                results.append({"itemID": item_id, "success": False, "message": "Item is already ordered"})
                continue

            # Add item to the order
            cursor.execute(
                """
                INSERT INTO ItemIn (itemID, orderID, found)
                VALUES (%s, %s, FALSE)
                """,
                (item_id, order_id)
            )

            # Mark item as ordered
            cursor.execute(
                """
                UPDATE Item SET isOrdered = TRUE WHERE itemID = %s
                """,
                (item_id,)
            )

            results.append({"itemID": item_id, "success": True, "message": "Item added to order"})


        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({"success": True, "message": "Item added to order"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": "Error adding item to order", "error": str(e)}), 500
